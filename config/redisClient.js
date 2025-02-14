// config/redisClient.js
const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

(async () => {
  try {
    await redis.set("test", "Hello, Upstash!"); // Test connection
    console.log("✅ Redis Connected & Test Key Set!");
  } catch (error) {
    console.error("❌ Redis Connection Error:", error);
  }
})();

module.exports = redis;
