const express = require("express");
// const mysql = require("mysql2"); // Remove this line - use the pool from db.js
const cors = require("cors");
const cookieParser = require("cookie-parser"); // 1. Import cookie-parser
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---

// 2. Configure CORS properly
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend origin (adjust if different)
    credentials: true, // IMPORTANT: Allow cookies to be sent/received
  })
);

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // 3. Add cookie-parser middleware

// --- Database Connection ---
// 4. Use the pool exported from db.js
const db = require("./db.js");

// Optional: Test DB connection pool on startup
db.query("SELECT 1", (err, results) => {
  if (err) {
    console.error("Failed to get connection from pool:", err);
    // Consider exiting if DB connection is critical for startup
    // process.exit(1);
  } else {
    console.log("Successfully connected to MySQL database pool.");
  }
});

// --- Routes ---
const entityRoutes = require("./routes"); // Renamed for clarity (optional)
const authRoutes = require("./authroutes"); // 5. Import auth routes (corrected filename)

app.use("/api", entityRoutes); // Mount entity routes (users, entities)
app.use("/auth", authRoutes); // 6. Mount authentication routes

// --- Server Start ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
