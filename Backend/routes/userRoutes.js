const express = require("express");
const router = express.Router();
const User = require("../models/User");


// Register User
router.post("/register", async (req, res) => {

    try {

        const newUser = new User(req.body);

        await newUser.save();

        res.status(200).json("User Registered Successfully");

    } catch (error) {

        res.status(500).json(error);

    }

});

module.exports = router;