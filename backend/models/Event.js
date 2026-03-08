const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  registrationDeadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Upcoming", "Completed", "Cancelled"],
    default: "Upcoming"
  },
  capacity: { type: Number, required: true },
  registeredCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isDraft: { type: Boolean, default: true },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);