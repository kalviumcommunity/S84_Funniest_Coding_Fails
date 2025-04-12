const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { body, validationResult } = require("express-validator"); // Import express-validator

dotenv.config();
const router = express.Router();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Database"))
  .catch((error) => console.error("Failed to connect to Database:", error));

const FunniestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
});

const Funniest = mongoose.model("Funniest", FunniestSchema);


router.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    if (req.headers["content-type"] !== "application/json") {
      return res.status(400).json({ error: "Content-Type must be application/json" });
    }
  }
  next();
});

// Create
router.post(
  "/funniest",
  [
    body("name").notEmpty().withMessage("Name is required"), // Validate name
    body("description").notEmpty().withMessage("Description is required"), // Validate description
    body("author").optional().isString().withMessage("Author must be a string"), // Validate author (optional)
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    try {
      const funniest = new Funniest(req.body);
      const result = await funniest.save();
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

// Read
router.get("/funniest", async (req, res) => {
  try {
    const funniest = await Funniest.find();
    res.status(200).send(funniest);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update
router.put("/funniest/:id", async (req, res) => {
  try {
    const result = await Funniest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete
router.delete("/funniest/:id", async (req, res) => {
  try {
    const result = await Funniest.findByIdAndDelete(req.params.id);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;