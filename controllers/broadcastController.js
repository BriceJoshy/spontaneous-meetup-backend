const redis = require("../config/redisClient");
const Broadcast = require("../models/Broadcast");
const { producer } = require("../notifications_kafkaClient/kafkaClient");

// Fetch broadcasts with caching
const getBroadcasts = async (req, res) => {
  try {
    // 🔹 Check Redis Cache
    const cachedData = await redis.get("active_broadcasts");
    if (cachedData) {
      console.log("✅ Fetching from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    // 🔹 Fetch from MongoDB
    console.log("📡 Fetching from MongoDB...");
    const broadcasts = await Broadcast.find({
      expiresAt: { $gt: new Date() },
    }).lean();
    console.log("📡 MongoDB Broadcasts:", broadcasts);

    if (broadcasts.length > 0) {
      await redis.setex("active_broadcasts", 60, JSON.stringify(broadcasts)); // Set TTL (60s)
    }

    res.json(broadcasts);
  } catch (error) {
    console.error("❌ Error fetching broadcasts:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Join a broadcast
const joinBroadcast = async (req, res) => {
  try {
    const { broadcastId, userId } = req.body;

    // 🔹 Validate input
    if (!broadcastId || !userId) {
      return res.status(400).json({ message: "Missing broadcastId or userId" });
    }

    // 🔹 Find Broadcast
    const broadcast = await Broadcast.findById(broadcastId);
    if (!broadcast) {
      return res.status(404).json({ message: "Broadcast not found" });
    }

    // 🔹 Check if user already joined
    if (broadcast.requests.includes(userId)) {
      return res.status(400).json({ message: "User already joined" });
    }

    // 🔹 Add user to broadcast
    broadcast.requests.push(userId);
    await broadcast.save();

    // 🔹 Publish event to Kafka (if producer is connected)
    if (producer && producer.isConnected()) {
      await producer.send({
        topic: "user_joins",
        messages: [{ value: JSON.stringify({ broadcastId, userId }) }],
      });
      console.log(
        `✅ Kafka Event Sent: User ${userId} joined Broadcast ${broadcastId}`
      );
    } else {
      console.warn("⚠️ Kafka producer not connected");
    }

    res.status(200).json({ message: "User joined successfully!" });
  } catch (error) {
    console.error("❌ Error in joinBroadcast:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { getBroadcasts, joinBroadcast };
