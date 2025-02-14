const Broadcast = require("../models/broadcastModel");
const { producer } = require("../kafkaClient");

const cleanExpiredBroadcasts = async () => {
  const now = Date.now();
  const expiredBroadcasts = await Broadcast.find({ expiresAt: { $lte: now } });

  for (const broadcast of expiredBroadcasts) {
    // 🔹 Publish expiration event to Kafka
    await producer.send({
      topic: "broadcast_expired",
      messages: [{ value: JSON.stringify(broadcast) }],
    });

    await Broadcast.deleteOne({ _id: broadcast._id });
  }
  console.log(`🗑️ Expired broadcasts removed: ${expiredBroadcasts.length}`);
};

// Run every minute
setInterval(cleanExpiredBroadcasts, 60000);

module.exports = cleanExpiredBroadcasts;
