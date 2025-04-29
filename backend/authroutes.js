const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken"); // 1. Import jsonwebtoken
const db = require("./db.js");
require("dotenv").config(); // Ensure .env variables are loaded

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // 2. Get secret from environment

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1); // Exit if secret is missing
}

// --- Login Endpoint ---
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    // Skipping password validation for this example
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email /*, password */ } = req.body;

    db.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          console.error("Error during login query:", err);
          return res.status(500).send({ error: "Server error during login" });
        }

        if (results.length === 0) {
          return res.status(401).send({ error: "Invalid credentials" });
        }

        const user = results[0];

        // --- 3. Create JWT ---
        const payload = {
          userId: user.id,
          name: user.name,
          // Add other non-sensitive info if needed (e.g., roles)
        };

        // Sign the token
        const token = jwt.sign(
          payload,
          JWT_SECRET,
          { expiresIn: "1d" } // Token expires in 1 day (e.g., '1h', '7d')
        );

        // --- 4. Set JWT in Cookie ---
        // Name the cookie 'token' (or similar) instead of 'username'
        res.cookie("token", token, {
          // Store the JWT
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        });

        // Send success response (don't need to send user details if token is set)
        res.status(200).send({
          message: "Login successful",
          // Optionally send back non-sensitive user info for immediate UI update
          user: { name: user.name },
        });
      }
    );
  }
);

// --- Logout Endpoint ---
router.post("/logout", (req, res) => {
  // --- 5. Clear the JWT cookie ---
  res.clearCookie("token", {
    // Clear the 'token' cookie
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.status(200).send({ message: "Logout successful" });
});

// --- Check Login Status Endpoint ---
router.get("/status", (req, res) => {
  // --- 6. Read and Verify JWT from Cookie ---
  const token = req.cookies.token; // Get token from cookie

  if (!token) {
    return res.status(200).send({ loggedIn: false }); // No token means not logged in
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, JWT_SECRET);

    // Token is valid, send back user info from the token payload
    res.status(200).send({
      loggedIn: true,
      user: {
        // Send back data stored in the token
        id: decoded.userId,
        name: decoded.name,
        // Include other data from payload if needed
      },
    });
  } catch (error) {
    // Token is invalid or expired
    console.error("JWT verification failed:", error.message);
    // Clear the invalid cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    return res.status(200).send({ loggedIn: false }); // Treat invalid token as not logged in
  }
});

module.exports = router;
