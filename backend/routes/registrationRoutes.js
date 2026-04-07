const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");

// create registration
router.post("/", registrationController.createRegistration);

// get all registrations
router.get("/", registrationController.getAllRegistrations);

// get registration history by email
router.get("/email/:email", registrationController.getRegistrationsByEmail);

// update payment status
router.put("/:id/payment", registrationController.updatePaymentStatus);

// cancel registration
router.put("/:id/cancel", registrationController.cancelRegistration);

module.exports = router;