const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: String },
  location: { type: String },
  date: { type: Date },
  capacity: { type: Number },
  registeredCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["Upcoming", "Completed", "Cancelled"],
    default: "Upcoming"
  },
  deadline: { type: Date },
  isDraft: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
});

module.exports = mongoose.model("Event", eventSchema);
