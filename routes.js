import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Database"))
  .catch((error) => console.error("Failed to connect to Database:", error));

const FunniestSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Funniest = mongoose.model("Funniest", FunniestSchema);

router.post("/funniest", async (req, res) => {
  try {
    const funniest = new Funniest(req.body);
    const result = await funniest.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});
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
