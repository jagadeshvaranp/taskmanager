require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// --- 1. MIDDLEWARE SETUP ---

// Standard CORS Configuration
app.use(
  cors({
    origin: [
      "https://taskloop-phi.vercel.app", 
      "http://localhost:5173", 
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Chrome Local Network Access (LNA) Fix
// This must be placed before your routes to handle the preflight checks
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Private-Network", "true");
  
  // Handle the Preflight (OPTIONS) request immediately
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Body Parser (needed to read JSON data from requests)
app.use(express.json());

// --- 2. DATABASE CONNECTION ---
connectDB();

// --- 3. ROUTES ---

// Auth, User, Task, and Report API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// Static uploads folder for profile pictures or attachments
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root health check
app.get("/", (req, res) => {
  res.send("TaskLoop API is running...");
});

// --- 4. SERVER INITIALIZATION ---

// Only start the server if not in a serverless production environment (like Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;