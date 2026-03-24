const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// GET all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create event
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      venue,
      capacity,
      cancelDeadline,
    } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      venue,
      capacity,
      cancelDeadline,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;