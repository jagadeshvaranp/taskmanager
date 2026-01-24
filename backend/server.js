require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MongoDB connection
connectDB();
// console.log("MONGO_URL =", process.env.MONGO_URL); // Good for debugging, remove for production

// Body parser
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// NOTE: Vercel does not support persistent file uploads to the local disk.
// If you are using Cloudinary, you don't need this line.
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server Setup for Vercel
const PORT = process.env.PORT || 5000;

// Only run the server manually if NOT in Vercel (Local Development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for Vercel Serverless Functions
module.exports = app;