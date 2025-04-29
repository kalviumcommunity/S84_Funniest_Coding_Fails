const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("./db.js"); // Import MySQL connection

const router = express.Router();

// --- Login Endpoint ---
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    // IMPORTANT: In a real app, you'd validate the password here too.
    // We are skipping password validation for this simplified example.
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email /*, password */ } = req.body; // Password received but not used for validation here

    // --- SIMULATED LOGIN ---
    // Find user by email. In a real app, you'd also compare hashed passwords.
    db.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          console.error("Error during login query:", err);
          return res.status(500).send({ error: "Server error during login" });
        }

        // Check if user exists (Simulating password check success if user found)
        if (results.length === 0) {
          return res.status(401).send({ error: "Invalid credentials" }); // User not found
        }

        // --- Login Successful (User Found) ---
        const user = results[0];

        // Set username cookie
        // Secure: true should be used in production with HTTPS
        // HttpOnly: true prevents client-side JavaScript access
        // SameSite: 'Lax' or 'Strict' helps prevent CSRF
        res.cookie("username", user.name, {
          httpOnly: true, // Recommended for security
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          sameSite: "Lax", // Or 'Strict'
          maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day (milliseconds)
        });

        // Send success response (optionally include some user info, but not sensitive data)
        res.status(200).send({
          message: "Login successful",
          user: { id: user.id, name: user.name, email: user.email },
        });
      }
    );
  }
);

// --- Logout Endpoint ---
router.post("/logout", (req, res) => {
  // Clear the username cookie
  res.clearCookie("username", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.status(200).send({ message: "Logout successful" });
});

// --- (Optional) Check Login Status Endpoint ---
// Useful for frontend to know if a user is logged in
router.get("/status", (req, res) => {
  const username = req.cookies.username; // Requires cookie-parser middleware
  if (username) {
    // In a real app, you might want to verify this username against the DB
    res.status(200).send({ loggedIn: true, username: username });
  } else {
    res.status(200).send({ loggedIn: false });
  }
});

module.exports = router;
