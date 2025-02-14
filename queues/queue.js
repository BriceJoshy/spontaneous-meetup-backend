const { Queue, Worker } = require("bullmq");
const redis = require("../config/redisClient");
const Broadcast = require("../models/Broadcast"); // Import Broadcast model

// ✅ Explicitly pass Redis connection
const requestQueue = new Queue("broadcastQueue", { connection: redis });

// ✅ Worker processes join requests
new Worker(
  "broadcastQueue",
  async (job) => {
    if (job.name === "joinRequest") {
      const { broadcastId, userId } = job.data;

      console.log(`Processing join request for broadcast: ${broadcastId}`);

      // ✅ Find the broadcast in MongoDB
      const broadcast = await Broadcast.findById(broadcastId);
      if (!broadcast) {
        console.log("Broadcast not found!");
        return;
      }

      // ✅ Add user to the requests array if not already present
      if (!broadcast.requests.includes(userId)) {
        broadcast.requests.push(userId);
        await broadcast.save();
        console.log("User added to broadcast requests!");
      } else {
        console.log("User already joined.");
      }
    }
  },
  { connection: redis }
);

module.exports = requestQueue;
