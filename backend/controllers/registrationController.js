const Event = require("../models/Event");
const Registration = require("../models/Registration");

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

exports.createRegistration = async (req, res) => {
  try {
    const { eventId, studentName, email, department, year } = req.body;

    if (!eventId || !studentName || !email || !department || !year) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address"
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (event.status !== "Upcoming") {
      return res.status(400).json({
        message: "Registration is only allowed for upcoming events"
      });
    }

    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        message: "Registration deadline has passed"
      });
    }

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        message: "Event is full"
      });
    }

    const existingRegistration = await Registration.findOne({
      event: eventId,
      email: email.toLowerCase()
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You have already registered for this event"
      });
    }

    const registration = new Registration({
      event: eventId,
      studentName,
      email: email.toLowerCase(),
      department,
      year,
      paymentStatus: "Pending",
      bookingStatus: "Confirmed"
    });

    const savedRegistration = await registration.save();

    event.registeredCount += 1;
    await event.save();

    res.status(201).json({
      message: "Registration successful",
      registration: savedRegistration
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({
        message: "You have already registered for this event"
      });
    }

    res.status(500).json({
      message: err.message || "Internal server error"
    });
  }
};

exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("event", "title date location")
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error"
    });
  }
};

exports.getRegistrationsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const registrations = await Registration.find({
      email: email.toLowerCase()
    })
      .populate("event", "title date location")
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error"
    });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!["Pending", "Paid", "Failed"].includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status"
      });
    }

    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found"
      });
    }

    registration.paymentStatus = paymentStatus;
    await registration.save();

    res.json({
      message: "Payment status updated successfully",
      registration
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error"
    });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found"
      });
    }

    if (registration.bookingStatus === "Cancelled") {
      return res.status(400).json({
        message: "Registration already cancelled"
      });
    }

    registration.bookingStatus = "Cancelled";
    await registration.save();

    const event = await Event.findById(registration.event);

    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }

    res.json({
      message: "Registration cancelled successfully",
      registration
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error"
    });
  }
};