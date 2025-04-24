const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const db = require("./db.js"); // Import MySQL connection

// Fetch all users
router.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send({ error: "Failed to fetch users" });
    }
    res.status(200).send(results);
  });
});

// Fetch entities by user
router.get("/entities/user/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query("SELECT * FROM entities WHERE created_by = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error fetching entities by user:", err);
      return res.status(500).send({ error: "Failed to fetch entities by user" });
    }
    res.status(200).send(results);
  });
});

// Create a new entity
router.post(
  "/entities",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("created_by").notEmpty().withMessage("Created_by is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, author, created_by } = req.body;
    db.query(
      "INSERT INTO entities (name, description, author, created_by) VALUES (?, ?, ?, ?)",
      [name, description, author, created_by],
      (err, result) => {
        if (err) {
          console.error("Error creating entity:", err);
          return res.status(500).send({ error: "Failed to create entity" });
        }
        res.status(201).send({ id: result.insertId, ...req.body });
      }
    );
  }
);

module.exports = router;