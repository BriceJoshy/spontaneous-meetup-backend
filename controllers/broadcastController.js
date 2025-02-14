const redis = require("../redisClient");
const Broadcast = require("../models/Broadcast");

// Fetch broadcasts with caching
const getBroadcasts = async (req, res) => {
  try {
    const cachedData = await redis.get("active_broadcasts");
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const broadcasts = await Broadcast.find({ expiresAt: { $gt: new Date() } });

    await redis.set("active_broadcasts", JSON.stringify(broadcasts), "EX", 60); // Cache for 60 seconds

    res.json(broadcasts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching broadcasts", error });
  }
};

module.exports = { getBroadcasts };
