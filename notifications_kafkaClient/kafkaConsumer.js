const { consumer } = require("./kafkaClient");

const runConsumer = async () => {
  await consumer.subscribe({
    topic: "broadcast_notifications",
    fromBeginning: true,
  });
  await consumer.subscribe({ topic: "user_joins", fromBeginning: true });
  await consumer.subscribe({ topic: "broadcast_expired", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value);
      console.log(`📩 Received message from ${topic}:`, data);

      if (topic === "broadcast_notifications") {
        console.log("📢 New Broadcast Created:", data);
        // Notify users via WebSockets, email, or push notifications
      }

      if (topic === "user_joins") {
        console.log("👥 User Joined Broadcast:", data);
        // Notify broadcast owner that a user joined
      }

      if (topic === "broadcast_expired") {
        console.log("🗑️ Broadcast Expired:", data);
        // Clean up frontend cache, notify users, etc.
      }
    },
  });
};

module.exports = runConsumer;
