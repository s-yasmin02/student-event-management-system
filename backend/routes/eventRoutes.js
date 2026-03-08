const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const upload = require("../middleware/upload");

// Create event
router.post("/", upload.single("image"), eventController.createEvent);

// Get all events
router.get("/", eventController.getEvents);

// Update event
router.put("/:id", upload.single("image"), eventController.updateEvent);

// Delete event
router.delete("/:id", eventController.deleteEvent);

module.exports = router;