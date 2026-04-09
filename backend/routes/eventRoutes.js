const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const upload = require("../middleware/upload");
const { verifyToken, requireAdmin } = require("../middleware/auth");

// Public routes (students can read)
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

// Protected admin-only routes
router.post("/", verifyToken, requireAdmin, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) return next();
    next();
  });
}, eventController.createEvent);

router.put("/:id", verifyToken, requireAdmin, upload.single("image"), eventController.updateEvent);
router.delete("/:id", verifyToken, requireAdmin, eventController.deleteEvent);

module.exports = router;