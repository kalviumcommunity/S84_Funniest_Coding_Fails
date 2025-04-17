const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { body, validationResult } = require("express-validator");

dotenv.config();
const router = express.Router();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Database"))
  .catch((error) => console.error("Failed to connect to Database:", error));

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", UserSchema);

// Define the Funniest schema
const FunniestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
});

const Funniest = mongoose.model("Funniest", FunniestSchema);

// Middleware to validate Content-Type
router.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    if (req.headers["content-type"] !== "application/json") {
      return res.status(400).json({ error: "Content-Type must be application/json" });
    }
  }
  next();
});

// Fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});
// Create a new user
router.post(
  "/users",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed. Check the input fields.",
        errors: errors.array(),
      });
    }

    try {
      const user = new User(req.body);
      const result = await user.save();
      res.status(201).send(result);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send({ error: "Failed to create user" });
    }
  }
);



// Fetch all entities
router.get("/funniest", async (req, res) => {
  try {
    const funniest = await Funniest.find().populate("created_by", "name");
    res.status(200).send(funniest);
  } catch (error) {
    console.error("Error fetching entities:", error);
    res.status(500).send({ error: "Failed to fetch entities" });
  }
});

// Fetch entities by created_by
router.get("/funniest/user/:userId", async (req, res) => {
  try {
    const entities = await Funniest.find({ created_by: req.params.userId }).populate("created_by", "name");
    res.status(200).send(entities);
  } catch (error) {
    console.error("Error fetching entities by user:", error);
    res.status(500).send({ error: "Failed to fetch entities by user" });
  }
});

// Create a new entity
router.post(
  "/funniest",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("author").optional().isString().withMessage("Author must be a string"),
    body("created_by").notEmpty().withMessage("Created_by is required"), // Validate created_by
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed. Check the input fields.",
        errors: errors.array(),
      });
    }

    try {
      const funniest = new Funniest(req.body);
      const result = await funniest.save();
      res.status(201).send(result);
    } catch (error) {
      console.error("Error creating entity:", error);
      res.status(500).send({ error: "Failed to create entity" });
    }
  }
);

// Update an entity
router.put(
  "/funniest/:id",
  [
    body("name").optional().isString().withMessage("Name must be a string"),
    body("description").optional().isString().withMessage("Description must be a string"),
    body("author").optional().isString().withMessage("Author must be a string"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed. Check the input fields.",
        errors: errors.array(),
      });
    }

    try {
      const result = await Funniest.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!result) {
        return res.status(404).json({ error: "Entity not found" });
      }
      res.status(200).send(result);
    } catch (error) {
      console.error("Error updating entity:", error);
      res.status(500).send({ error: "Failed to update entity" });
    }
  }
);

// Delete an entity
router.delete("/funniest/:id", async (req, res) => {
  try {
    const result = await Funniest.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Entity not found" });
    }
    res.status(200).json({ message: "Entity deleted successfully" });
  } catch (error) {
    console.error("Error deleting entity:", error);
    res.status(500).send({ error: "Failed to delete entity" });
  }
});

module.exports = router;