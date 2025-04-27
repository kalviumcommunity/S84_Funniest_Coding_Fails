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

// Fetch all entities
router.get("/entities", (req, res) => {
  db.query(
    "SELECT e.*, u.name as created_by_name FROM entities e JOIN users u ON e.created_by = u.id",
    (err, results) => {
      if (err) {
        console.error("Error fetching entities:", err);
        return res.status(500).send({ error: "Failed to fetch entities" });
      }
      res.status(200).send(results);
    }
  );
});

// Fetch a single entity by ID
router.get("/entities/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT e.*, u.name as created_by_name FROM entities e JOIN users u ON e.created_by = u.id WHERE e.id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching entity:", err);
        return res.status(500).send({ error: "Failed to fetch entity" });
      }
      if (results.length === 0) {
        return res.status(404).send({ error: "Entity not found" });
      }
      res.status(200).send(results[0]);
    }
  );
});

// Fetch entities by user
router.get("/entities/user/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query(
    "SELECT e.*, u.name as created_by_name FROM entities e JOIN users u ON e.created_by = u.id WHERE e.created_by = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching entities by user:", err);
        return res
          .status(500)
          .send({ error: "Failed to fetch entities by user" });
      }
      res.status(200).send(results);
    }
  );
});

// Create a new entity
router.post(
  "/entities",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("created_by")
      .notEmpty()
      .withMessage("Created_by is required")
      .isInt()
      .withMessage("Created_by must be an integer (user ID)"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, author, created_by } = req.body;
    db.query(
      "INSERT INTO entities (name, description, author, created_by) VALUES (?, ?, ?, ?)",
      [name, description, author || "Anonymous", created_by], // Provide default for author if empty
      (err, result) => {
        if (err) {
          console.error("Error creating entity:", err);
          // Check for foreign key constraint error
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res
              .status(400)
              .send({ error: "Invalid user ID provided for created_by" });
          }
          return res.status(500).send({ error: "Failed to create entity" });
        }
        // Fetch the newly created entity to include user name
        db.query(
          "SELECT e.*, u.name as created_by_name FROM entities e JOIN users u ON e.created_by = u.id WHERE e.id = ?",
          [result.insertId],
          (fetchErr, fetchResults) => {
            if (fetchErr || fetchResults.length === 0) {
              // Fallback response if fetching fails
              return res.status(201).send({ id: result.insertId, ...req.body });
            }
            res.status(201).send(fetchResults[0]);
          }
        );
      }
    );
  }
);

router.put("/entities/:id", (req, res) => {
  const { id } = req.params;
  // Add validation for PUT request
  const { name, description, author } = req.body;

  // Basic validation: ensure at least one field is provided
  if (!name && !description && !author) {
    return res.status(400).send({ error: "No fields provided for update" });
  }

  // Build the query dynamically based on provided fields
  let query = "UPDATE entities SET ";
  const values = [];
  if (name) {
    query += "name = ?, ";
    values.push(name);
  }
  if (description) {
    query += "description = ?, ";
    values.push(description);
  }
  if (author) {
    query += "author = ?, ";
    values.push(author);
  }
  // Remove trailing comma and space
  query = query.slice(0, -2);
  query += " WHERE id = ?";
  values.push(id);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating entity:", err);
      return res.status(500).send({ error: "Failed to update entity" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send({ error: "Entity not found or no changes made" });
    }
    // Fetch the updated entity to return it
    db.query(
      "SELECT e.*, u.name as created_by_name FROM entities e JOIN users u ON e.created_by = u.id WHERE e.id = ?",
      [id],
      (fetchErr, fetchResults) => {
        if (fetchErr || fetchResults.length === 0) {
          return res.status(200).send({
            message:
              "Entity updated successfully, but failed to fetch updated data",
          });
        }
        res.status(200).send(fetchResults[0]);
      }
    );
  });
});

// Delete an entity
router.delete("/entities/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM entities WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting entity:", err);
      return res.status(500).send({ error: "Failed to delete entity" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ error: "Entity not found" });
    }
    res.status(200).send({ message: "Entity deleted successfully" });
  });
});

module.exports = router;
