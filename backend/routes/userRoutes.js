const express = require("express");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

// =======================
// GET ALL USERS
// =======================
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// REGISTER USER
// =======================
router.post("/register", async (req, res) => {
  try {
    const {
      role,
      fullName,
      email,
      phone,
      password,
      collegeName,
      universityName,
      studentId,
      city,
      postcode,
    } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      role,
      fullName,
      email,
      phone,
      password,
      collegeName,
      universityName,
      studentId,
      city,
      postcode,
      studentVerified: role === "student" ? false : true,
      status: "Pending",
      kyc: "Not Verified",
      last_activity: new Date(),
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        status: user.status,
        kyc: user.kyc,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// UPDATE USER STATUS
// =======================
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Status updated",
      status: user.status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// GET USER BY ID
// =======================
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// =======================
// UPDATE USER
// =======================
router.put("/:id", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      role,
      city,
      postcode,
      kyc,
      status,
      collegeName,
      universityName,
      studentId,
      studentVerified,
      password,
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  BASIC INFO
    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;

    // ADDRESS
    if (city !== undefined) user.city = city;
    if (postcode !== undefined) user.postcode = postcode;

    // STATUS / KYC
    if (status !== undefined) user.status = status;
    if (kyc !== undefined) user.kyc = kyc;

    // STUDENT FIELDS (ONLY IF ROLE = STUDENT)
    if (role === "student") {
      user.collegeName = collegeName;
      user.universityName = universityName;
      user.studentId = studentId;
      if (studentVerified !== undefined) {
        user.studentVerified = studentVerified;
      }
    }

    // PASSWORD (HASHED BY PRE-SAVE HOOK)
    if (password) {
      user.password = password;
    }

    // LAST ACTIVITY
    user.last_activity = new Date().toISOString();

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        kyc: user.kyc,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: error.message });
  }
});


// =======================
// DELETE USER
// =======================
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// LOGIN USER
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // password check
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //  STATUS CHECK
    if (user.status !== "Active") {
      return res.status(403).json({
        message: `Your account is ${user.status}. Please contact admin.`,
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
router.get("/owners", async (req, res) => {
  try {
    const owners = await User.find({
      role: "owner",
      status: "Active",
    }).select("_id fullName email");

    return res.json({
      success: true,
      users: owners,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/simple-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token (basic)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Success response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
