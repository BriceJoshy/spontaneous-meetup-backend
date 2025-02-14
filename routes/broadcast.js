const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const Broadcast = require("../models/Broadcast");
const {
  getBroadcasts,
  joinBroadcast,
} = require("../controllers/broadcastController");

const router = express.Router();

// Create Broadcast (Requires Authentication)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { userId, date, time, location, activity } = req.body;
    const broadcast = await Broadcast.create({
      userId,
      date,
      time,
      location,
      activity,
      requests: [],
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
    });
    res.json(broadcast);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Broadcasts (Requires Authentication)
router.get("/", authenticateToken, getBroadcasts);

// Join Broadcast (Requires Authentication)
router.post("/joinBroadcast", authenticateToken, joinBroadcast);

module.exports = router;
