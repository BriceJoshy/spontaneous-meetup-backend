const redis = require("../config/redisClient");
const Broadcast = require("../models/Broadcast");
const requestQueue = require("../queues/queue");
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
    const broadcast = await Broadcast.findById(broadcastId);
    if (!broadcast)
      return res.status(404).json({ message: "Broadcast not found" });

    // 🔹 Publish event to Kafka
    await producer.send({
      topic: "user_joins",
      messages: [{ value: JSON.stringify({ broadcastId, userId }) }],
    });

    res.status(200).json({ message: "User joined successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error joining broadcast", error });
  }
};

module.exports = { getBroadcasts, joinBroadcast };
