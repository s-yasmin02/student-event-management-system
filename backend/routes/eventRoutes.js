const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const upload = require("../middleware/upload");

// Create event
router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return next();
    }
    next();
  });
}, eventController.createEvent);

// Get all events
router.get("/", eventController.getEvents);

// Get single event
router.get("/:id", eventController.getEventById);

// Update event
router.put("/:id", upload.single("image"), eventController.updateEvent);

// Delete event
router.delete("/:id", eventController.deleteEvent);

module.exports = router;