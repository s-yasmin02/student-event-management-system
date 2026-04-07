const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled"],
      default: "Upcoming"
    },
    capacity: { type: Number, required: true, min: 1 },
    registeredCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: true },
    image: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);