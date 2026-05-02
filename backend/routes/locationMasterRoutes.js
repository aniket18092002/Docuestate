const express = require("express");
const router = express.Router();
const LocationMaster = require("../models/LocationMaster");

/* ================= GET ALL ================= */
router.get("/", async (req, res) => {
  const data = await LocationMaster.find().sort({ createdAt: -1 });
  res.json(data);
});

/* ================= CREATE ================= */
router.post("/", async (req, res) => {
  const { location_name, description, status } = req.body;

  const exists = await LocationMaster.findOne({ location_name });
  if (exists) {
    return res.status(400).json({ message: "Location already exists" });
  }

  const data = await LocationMaster.create({
    location_name,
    description,
    status,
  });

  res.status(201).json(data);
});

/* ================= UPDATE ================= */
router.put("/:id", async (req, res) => {
  const { location_name, description, status } = req.body;

  const data = await LocationMaster.findByIdAndUpdate(
    req.params.id,
    { location_name, description, status },
    { new: true }
  );

  res.json(data);
});

/* ================= STATUS TOGGLE ================= */
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;

  const data = await LocationMaster.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(data);
});

module.exports = router;
