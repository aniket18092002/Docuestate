const express = require("express");
const router = express.Router();
const PropertyType = require("../models/PropertyType");

// ===============================
// GET ALL (Admin / List Page)
// ===============================
router.get("/", async (req, res) => {
  try {
    const data = await PropertyType.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// GET ACTIVE (Dropdown)
// ===============================
router.get("/active", async (req, res) => {
  try {
    const types = await PropertyType.find({ status: "Active" }).sort({
      propertyType: 1,
    });

    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// CREATE
// ===============================
router.post("/", async (req, res) => {
  try {
    const { propertyType, description, status } = req.body;

    if (!propertyType) {
      return res.status(400).json({ message: "Property Type is required" });
    }

    const exists = await PropertyType.findOne({ propertyType });
    if (exists) {
      return res.status(400).json({ message: "Property Type already exists" });
    }

    const item = await PropertyType.create({
      propertyType,
      description,
      status,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===============================
// GET BY ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const item = await PropertyType.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Property Type not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// UPDATE
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { propertyType, description, status } = req.body;

    const item = await PropertyType.findByIdAndUpdate(
      req.params.id,
      { propertyType, description, status },
      { new: true }
    );

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===============================
// UPDATE STATUS
// ===============================
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const item = await PropertyType.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
