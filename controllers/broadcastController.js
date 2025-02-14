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

    await requestQueue.add("joinRequest", { broadcastId, userId });

    res.json({ message: "Request added to queue!" });
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error });
  }
};

module.exports = { getBroadcasts, joinBroadcast };
