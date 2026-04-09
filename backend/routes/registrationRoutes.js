const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

// Student routes
router.post("/", verifyToken, registrationController.createRegistration);
router.get("/my", verifyToken, registrationController.getMyRegistrations);
router.patch("/:id/payment", verifyToken, registrationController.updatePaymentStatus);

// Admin-only routes
router.get("/admin", verifyToken, requireAdmin, registrationController.getAllRegistrations);
router.delete("/admin/:id", verifyToken, requireAdmin, registrationController.adminDeleteRegistration);

module.exports = router;
