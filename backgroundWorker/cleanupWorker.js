const Broadcast = require("./models/Broadcast");

const cleanExpiredBroadcasts = async () => {
  await Broadcast.deleteMany({ expiresAt: { $lt: new Date() } });
  console.log("Expired broadcasts deleted.");
};

// Run cleanup every 10 minutes
setInterval(cleanExpiredBroadcasts, 10 * 60 * 1000);
