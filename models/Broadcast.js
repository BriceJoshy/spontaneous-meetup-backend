const mongoose = require("mongoose");

const broadcastSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  activity: { type: String, required: true },
  requests: { type: Array, default: [] },
  expiresAt: { type: Date, index: { expires: '1h' } }, // ✅ Broadcast expires after 1 hour
});

const Broadcast = mongoose.model("Broadcast", broadcastSchema);

module.exports = Broadcast;
