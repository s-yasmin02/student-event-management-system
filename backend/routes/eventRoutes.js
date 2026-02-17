const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// Create Event
router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: "Duplicate title not allowed!" });
  }
});

// Get Events
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

module.exports = router;
