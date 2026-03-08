const Event = require("../models/Event");

// =======================
// CREATE EVENT
// =======================
exports.createEvent = async (req, res) => {
  try {
    const existingEvent = await Event.findOne({ title: req.body.title });

    if (existingEvent) {
      return res.status(400).json({
        message: "Duplicate title not allowed!"
      });
    }

    const newEvent = new Event({
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      date: req.body.date,
      registrationDeadline: req.body.registrationDeadline,
      capacity: req.body.capacity,
      description: req.body.description,
      image: req.file ? req.file.filename : null
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =======================
// GET ALL EVENTS
// =======================
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =======================
// UPDATE EVENT
// =======================
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // What registeredCount will be after update
    const newRegisteredCount =
      req.body.registeredCount !== undefined
        ? Number(req.body.registeredCount)
        : event.registeredCount;

    // What capacity will be after update
    const newCapacity =
      req.body.capacity !== undefined
        ? Number(req.body.capacity)
        : event.capacity;

    // Validation
    if (newCapacity < newRegisteredCount) {
      return res.status(400).json({
        message: "Capacity cannot be less than registered students"
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEvent);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// DELETE EVENT
// =======================
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};