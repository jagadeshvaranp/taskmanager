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
app.use(cors({
  origin: ["http://localhost:5173"], 
  credentials: true
}));

// --- ADD THIS BLOCK HERE TO FIX THE CHROME ERROR ---
app.use((req, res, next) => {
  // Allows the browser to proceed with local network requests
  res.header('Access-Control-Allow-Private-Network', 'true');
  
  // Handle Preflight (OPTIONS) requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
// --- END OF FIX ---

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
module.exports = app;