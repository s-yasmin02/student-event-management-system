const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const sendEmail = require("../utils/sendEmail");
const generateTicketPdf = require("../utils/generateTicketPdf");

// Register for an event
router.post("/", async (req, res) => {
  try {
    const { studentName, studentEmail, eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingRegistration = await Registration.findOne({
      studentEmail,
      event: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "Student already registered for this event",
      });
    }

    const totalRegistrations = await Registration.countDocuments({
      event: eventId,
    });

    if (totalRegistrations >= event.capacity) {
      return res.status(400).json({
        message: "Event is full. Cannot register",
      });
    }

    const registration = new Registration({
      studentName,
      studentEmail,
      event: eventId,
    });

    const savedRegistration = await registration.save();

    // 👉 PDF generate
    const pdfBuffer = await generateTicketPdf(savedRegistration, event);

    // 👉 Email send with PDF
    await sendEmail({
      to: studentEmail,
      subject: "Event Registration Successful",
      text: `Hello ${studentName},

You have successfully registered for the event.

Event: ${event.title}
Date: ${event.date}
Time: ${event.time}
Venue: ${event.venue}

Please find your ticket attached.

Thank you.`,
      attachments: [
        {
          filename: "ticket.pdf",
          content: pdfBuffer,
        },
      ],
    });

    res.status(201).json({
      message: "Registration successful and email sent",
      registration: savedRegistration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;