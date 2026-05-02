const express = require("express");
const router = express.Router();
const RangeMaster = require("../models/RangeMaster");

/* ======================================
   GET ALL RANGE MASTERS
====================================== */
router.get("/", async (req, res) => {
  try {
    const data = await RangeMaster.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================================
   CREATE RANGE MASTER
====================================== */
router.post("/", async (req, res) => {
  try {
    const { Range_name, description, status } = req.body;

    if (!Range_name) {
      return res.status(400).json({ message: "Range Name is required" });
    }

    const exists = await RangeMaster.findOne({ Range_name });
    if (exists) {
      return res.status(409).json({ message: "Range already exists" });
    }

    const range = await RangeMaster.create({
      Range_name,
      description,
      status,
    });

    res.status(201).json(range);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================================
   UPDATE RANGE MASTER
====================================== */
router.put("/:id", async (req, res) => {
  try {
    const { Range_name, description, status } = req.body;

    const updated = await RangeMaster.findByIdAndUpdate(
      req.params.id,
      { Range_name, description, status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Range not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================================
   UPDATE STATUS ONLY
====================================== */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await RangeMaster.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Range not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================================
   DELETE (OPTIONAL)
====================================== */
router.delete("/:id", async (req, res) => {
  try {
    await RangeMaster.findByIdAndDelete(req.params.id);
    res.json({ message: "Range deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
