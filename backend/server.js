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
// Allow multiple origins if needed
app.use(cors({
    origin: ["https://taskloop-phi.vercel.app"], // Remove trailing slash
    methods: ["POST", "GET", "PUT", "DELETE"], // Added PUT/DELETE for full CRUD
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

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 2. EXPORT THE APP FOR VERCEL
// Run app.listen only if not in production
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
