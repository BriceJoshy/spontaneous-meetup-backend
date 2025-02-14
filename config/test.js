const redis = require("./redisClient");

redis
  .ping()
  .then((res) => console.log("Redis Connected:", res))
  .catch((err) => console.error("Redis Connection Error:", err));
