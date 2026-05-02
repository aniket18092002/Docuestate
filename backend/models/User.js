const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["tenant", "owner", "student", "admin"],
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Inactive"],
      default: "Pending",
    },

    // 🎓 Student-only
    collegeName: String,
    universityName: String,
    studentId: String,

    studentVerified: {
      type: Boolean,
      default: false,
    },

    city: String,
    postcode: String,

    last_activity: {
      type: Date,
      default: Date.now,
    },

    kyc: {
      type: String,
      enum: ["Not Verified", "Pending", "Verified", "Rejected"],
      default: "Not Verified",
    },
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
