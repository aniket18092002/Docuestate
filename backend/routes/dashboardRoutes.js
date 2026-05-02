const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Property = require("../models/Property");

// ================= DASHBOARD STATS =================
router.get("/stats", async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: "Active" });
    const pendingListings = await Property.countDocuments({ status: "Pending" });

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "Active" });
    const inactiveUsers = await User.countDocuments({ status: "Inactive" });

    // current month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const monthListings = await Property.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const monthUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    res.json({
      totalProperties,
      activeProperties,
      pendingListings,
      totalUsers,
      activeUsers,
      inactiveUsers,
      monthListings,
      monthUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= RECENT USERS =================
router.get("/recent-users", async (req, res) => {
  try {
    const users = await User.find()
      .where("role").ne("admin")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName email phone role createdAt");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
