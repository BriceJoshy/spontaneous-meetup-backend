const express = require("express");
const Broadcast = require("../models/Broadcast");
const router = express.Router();

// Create Broadcast
router.post("/", async (req, res) => {
  try {
    const { userId, date, time, location, activity } = req.body;
    const broadcast = await Broadcast.create({
      userId,
      date,
      time,
      location,
      activity,
      requests: [],
    });
    res.json(broadcast);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Broadcasts
router.get("/", async (req, res) => {
  const broadcasts = await Broadcast.find();
  res.json(broadcasts);
});

module.exports = router;
