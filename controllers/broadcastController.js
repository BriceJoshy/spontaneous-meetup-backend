const redis = require("../config/redisClient");
const Broadcast = require("../models/Broadcast");
// const requestQueue = require("../queues/queue");
const { producer } = require("../notifications_kafkaClient/kafkaClient");

// Fetch broadcasts with caching
const getBroadcasts = async (req, res) => {
  try {
    const cachedData = await redis.get("active_broadcasts");
    if (cachedData) {
      console.log("Fetching from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    console.log("Fetching from MongoDB");
    const broadcasts = await Broadcast.find({ expiresAt: { $gt: new Date() } });
    console.log("Broadcasts from MongoDB:", broadcasts);

    if (broadcasts.length > 0) {
      await redis.set(
        "active_broadcasts",
        JSON.stringify(broadcasts),
        "EX",
        60
      ); // Cache for 60 seconds
    }

    res.json(broadcasts);
  } catch (error) {
    console.error("Error fetching broadcasts:", error);
    res.status(500).json({ message: "Error fetching broadcasts", error });
  }
};

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

    // 🔹 Check if user is already in the broadcast
    if (broadcast.requests.includes(userId)) {
      return res.status(400).json({ message: "User already joined" });
    }

    // 🔹 Add user to broadcast
    broadcast.requests.push(userId);
    await broadcast.save();

    // 🔹 Publish event to Kafka (only if producer is connected)
    if (producer) {
      await producer.send({
        topic: "user_joins",
        messages: [{ value: JSON.stringify({ broadcastId, userId }) }],
      });
    } else {
      console.warn("⚠️ Kafka producer not connected");
    }

    res.status(200).json({ message: "User joined successfully!" });
  } catch (error) {
    console.error("❌ Error in joinBroadcast:", error);
    res.status(500).json({ message: "Error joining broadcast", error });
  }
};

module.exports = { getBroadcasts, joinBroadcast };
