require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes=require("./routes/authRoutes")
const userRoutes=require("./routes/userRoutes")
const app = express();

// Middleware to handle CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// MongoDB connection
connectDB();
console.log("MONGO_URL =", process.env.MONGO_URL);


// Middleware
app.use(express.json());



// Routing (add your routes here)
app.use("/api/auth",authRoutes)
app.use("/api/auth",userRoutes)

// Server running
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
