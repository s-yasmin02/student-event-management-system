const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const eventRoutes = require("./routes/eventRoutes");  // 👈 ADD THIS

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/eventDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/events", eventRoutes);  // 👈 ADD THIS

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
