require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { initKafka } = require("./notifications_kafkaClient/kafkaClient");
const runConsumer = require("./notifications_kafkaClient/kafkaConsumer");
const cleanExpiredBroadcasts = require("./backgroundWorker/cleanupWorker");
const setupSwagger = require("./config/swagger");
// Authentication routes:
const authRoutes = require("./routes/auth");

// Broadcast routes:
const broadcastRoutes = require("./routes/broadcast");
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(limiter);

setupSwagger(app); // Initialize Swagger

// Authentication routes:
app.use("/api/auth", authRoutes);

// Broadcast routes:
app.use("/api/broadcasts", broadcastRoutes);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Sample Route
app.get("/", (req, res) => {
  res.send("Spontaneous Meetup API is running...");
});

initKafka(); // 🔹 Connect Kafka
runConsumer(); // 🔹 Start Kafka Consumer
cleanExpiredBroadcasts(); // 🔹 Run Cleanup Worker
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
