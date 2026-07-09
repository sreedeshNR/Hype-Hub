const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "admin@hypehub.com" });
  if (existing) {
    console.log("Admin already exists!");
    process.exit();
  }

const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
await User.create({
  fullName: "HypeHub Admin",
  username: "hypehub_admin",
  email: process.env.ADMIN_EMAIL,
  password: hashedPassword,
  role: "ADMIN",
  isVerified: true,
});

  console.log("✅ Admin created! Email: admin@hypehub.com | Password: Admin@123");
  process.exit();
};

createAdmin();