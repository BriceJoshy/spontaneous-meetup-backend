const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const Broadcast = require("../models/Broadcast");
const {
  getBroadcasts,
  joinBroadcast,
} = require("../controllers/broadcastController");
const { producer } = require("../notifications_kafkaClient/kafkaClient");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Broadcasts
 *   description: Broadcast-related endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/broadcasts:
 *   post:
 *     summary: Create a new broadcast
 *     tags: [Broadcasts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64f8b0c3a5e7e6b8d7c1a9d9"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-15"
 *               time:
 *                 type: string
 *                 example: "14:00"
 *               location:
 *                 type: string
 *                 example: "Central Park, NY"
 *               activity:
 *                 type: string
 *                 example: "Football match"
 *     responses:
 *       200:
 *         description: Broadcast created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 */
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

    // 🔹 Send Kafka event
    await producer.send({
      topic: "broadcast_notifications",
      messages: [{ value: JSON.stringify(broadcast) }],
    });

    res.json(broadcast);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/broadcasts:
 *   get:
 *     summary: Get all broadcasts
 *     tags: [Broadcasts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of broadcasts
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 */
router.get("/", authenticateToken, getBroadcasts);

/**
 * @swagger
 * /api/broadcasts/joinBroadcast:
 *   post:
 *     summary: Join a broadcast
 *     tags: [Broadcasts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64f8b0c3a5e7e6b8d7c1a9d9"
 *               broadcastId:
 *                 type: string
 *                 example: "67afb2e452ed0d7a9b469111"
 *     responses:
 *       200:
 *         description: Successfully joined broadcast
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: Broadcast not found
 */

router.post("/joinBroadcast", authenticateToken, joinBroadcast);

module.exports = router;
