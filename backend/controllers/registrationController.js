const Registration = require("../models/Registration");
const Event = require("../models/Event");

// =======================
// CREATE REGISTRATION
// =======================
exports.createRegistration = async (req, res) => {
  try {
    const { eventId, studentName, email, department, year } = req.body;
    const studentId = req.user._id;

    if (!eventId || !studentName || !email || !department || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check event exists and is registerable
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.isDraft) return res.status(400).json({ message: "Event is not published yet" });
    if (event.status !== "Upcoming") return res.status(400).json({ message: "Registration is closed for this event" });
    if (new Date(event.registrationDeadline) < new Date()) {
      return res.status(400).json({ message: "Registration deadline has passed" });
    }
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Check duplicate registration
    const existing = await Registration.findOne({ student: studentId, event: eventId });
    if (existing) {
      return res.status(400).json({ message: "You have already registered for this event" });
    }

    // Create registration
    const registration = await Registration.create({
      student: studentId,
      event: eventId,
      studentName,
      email,
      department,
      year
    });

    // Increment event registered count
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

    res.status(201).json(registration);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already registered for this event" });
    }
    res.status(500).json({ message: err.message });
  }
};

// =======================
// GET MY REGISTRATIONS
// =======================
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user._id })
      .populate("event", "title date location status category")
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// UPDATE PAYMENT STATUS
// =======================
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const registrationId = req.params.id;

    if (!["pending", "completed", "failed"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const registration = await Registration.findOneAndUpdate(
      { _id: registrationId, student: req.user._id },
      { paymentStatus },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// ADMIN: GET ALL REGISTRATIONS
// =======================
exports.getAllRegistrations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventId) filter.event = req.query.eventId;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const registrations = await Registration.find(filter)
      .populate("student", "name email")
      .populate("event", "title date location category")
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// ADMIN: DELETE A REGISTRATION
// =======================
exports.adminDeleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    // Decrement event registered count
    await Event.findByIdAndUpdate(registration.event, { $inc: { registeredCount: -1 } });
    res.json({ message: "Registration removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
