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

// 1. UPDATED CORS CONFIGURATION
// We use a function for origin to allow multiple origins (your deployed frontend + localhost)
app.use(cors({
    origin: ["https://taskloop-phi.vercel.app/", "http://localhost:5000"], // REPLACE with your actual Frontend URL
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

// MongoDB connection
connectDB();

// Body parser
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// 2. EXPORT THE APP FOR VERCEL
// Vercel needs 'module.exports = app' to run serverless.
// We only run app.listen if we are NOT in production (or specifically locally).
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;