const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/auth");

router.post("/register", upload.single("profileImage"), authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-verification", authController.resendVerification);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/me", verifyToken, authController.getMe);

module.exports = router;