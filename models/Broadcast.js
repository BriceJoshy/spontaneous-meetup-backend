const mongoose = require("mongoose");

const BroadcastSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  time: String,
  location: String,
  activity: String,
  requests: [{ userId: String, status: String }],
});

module.exports = mongoose.model("Broadcast", BroadcastSchema);
