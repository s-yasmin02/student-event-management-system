/**
 * Admin Seed Script
 * 
 * Run this once to create the admin account:
 *   node seedAdmin.js
 * 
 * This creates an admin user in the database.
 * You can then log in at /login with these credentials.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const ADMIN_EMAIL = "admin@evenza.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Admin";

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      if (existing.role !== "admin") {
        // Upgrade existing user to admin
        existing.role = "admin";
        await existing.save();
        console.log(`✅ Updated existing user '${ADMIN_EMAIL}' to admin role`);
      } else {
        console.log(`ℹ️  Admin user '${ADMIN_EMAIL}' already exists`);
      }
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin"
      });
      console.log(`✅ Admin user created:`);
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log(`\n⚠️  Please change the password after first login.`);
    }
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
