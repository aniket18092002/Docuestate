const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const { protect } = require("../middleware/authMiddleware");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const PropertyAttachment = require("../models/PropertyAttachment");
const upload = require("../middleware/uploadMiddleware");
const Counter = require("../models/Counter");

// ===============================
// GET ALL PROPERTIES
// ===============================
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find({})
      .populate("owner", "fullName email phone")
      .populate("propertyType", "propertyType")
      .populate("area", "location_name")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error("GET PROPERTIES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

router.get("/owner/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const properties = await Property.find({ owner: ownerId })
      .populate("owner", "fullName email")
      .populate("propertyType", "propertyType")
      .populate("area", "location_name")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error("OWNER PROPERTIES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch owner properties" });
  }
});
router.get("/search", async (req, res) => {
  try {
    const { keyword, location, type, min, max } = req.query;

    let query = { status: "Active" };

    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    if (location && mongoose.Types.ObjectId.isValid(location)) {
      query.area = new mongoose.Types.ObjectId(location);
    }

    if (type && mongoose.Types.ObjectId.isValid(type)) {
      query.propertyType = new mongoose.Types.ObjectId(type);
    }

    if (min && max) {
      query.rent = {
        $gte: Number(min),
        $lte: Number(max),
      };
    }

    const properties = await Property.find(query)
      .populate("area", "location_name")
      .populate("propertyType", "propertyType");

    res.json(properties);
  } catch (err) {
    console.error("SEARCH ERROR 👉", err);
    res.status(500).json({ message: "Search failed" });
  }
});
router.get("/rent-ranges", async (req, res) => {
  try {
    const rents = await Property.find(
      { rent: { $ne: null } },
      { rent: 1, _id: 0 }
    );

    if (!rents.length) return res.json([]);

    const values = rents.map(r => r.rent);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const step = Math.ceil((max - min) / 5);

    let ranges = [];
    let start = min;

    while (start < max) {
      const end = start + step;
      ranges.push({
        label: `£${start} - £${end}`,
        min: start,
        max: end,
      });
      start = end + 1;
    }

    res.json(ranges);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate ranges" });
  }
});
router.get("/search-suggestions", async (req, res) => {
  const q = req.query.q || "";

  const properties = await Property.find({
    title: { $regex: q, $options: "i" }
  })
    .limit(5)
    .select("title");

  res.json(properties);
});





// ===============================
// GET PROPERTY BY ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "fullName email phone")
      .populate("propertyType", "propertyType")
      .populate("area", "location_name");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ===============================
// CREATE PROPERTY
// ===============================
router.post("/", upload.array("attachments"), async (req, res) => {
  try {
    // Get next sequence
    const counter = await Counter.findOneAndUpdate(
      { name: "property_listing" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const listingId = `PROP-${String(counter.seq).padStart(3, "0")}`;

    // Normalize remarks
    let remarks = [];
    if (Array.isArray(req.body["remarks[]"])) {
      remarks = req.body["remarks[]"];
    } else if (req.body["remarks[]"]) {
      remarks = [req.body["remarks[]"]];
    }

    // Map attachments
    const attachments = req.files.map((file, index) => ({
      file: `/uploads/${file.filename}`,
      remarks: remarks[index] || "",
    }));

    const propertyData = {
      listingId, // AUTO GENERATED
      title: req.body.title,
      owner: req.body.owner,
      propertyType: req.body.propertyType,
      area: req.body.area,
      postcode: req.body.postcode,
      rent: req.body.rent,
      deposit: req.body.deposit,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      furnishing: req.body.furnishing,
      availableFrom: req.body.availableFrom,
      leaseType: req.body.leaseType,
      epcRating: req.body.epcRating,
      status: req.body.status || "Pending",
      property_listed: req.body.property_listed || "0",
      attachments,
    };

    const property = await Property.create(propertyData);

    res.status(201).json(property);
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);
    res.status(400).json({ message: error.message });
  }
});




// ===============================
// UPDATE PROPERTY
// ===============================

router.put("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// ===============================
// UPDATE PROPERTY STATUS
// ===============================
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});;
router.patch("/:id/property_listed", async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { property_listed: req.body.status },
      { new: true }
    );
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});






router.patch("/:id/featured-image", async (req, res) => {
  try {
    const { featured_image } = req.body;

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        featured_image,
        status: "Active", // AUTO ACTIVATE
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



router.patch("/:id/landing-image", async (req, res) => {
  const { attachmentId } = req.body;

  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  property.attachments.forEach((att) => {
    att.isLanding = att._id.toString() === attachmentId;
  });

  await property.save();

  res.json({ success: true });
});


router.delete("/:propertyId/attachment/:attachmentId", async (req, res) => {
  try {
    const { propertyId, attachmentId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const attachment = property.attachments.find(
      (a) => a._id.toString() === attachmentId
    );

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    //  delete file
    if (attachment.file) {
      const cleanPath = attachment.file.startsWith("/")
        ? attachment.file.slice(1)
        : attachment.file;

      const filePath = path.join(__dirname, "..", cleanPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // remove from DB
    property.attachments = property.attachments.filter(
      (a) => a._id.toString() !== attachmentId
    );

    await property.save();

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ATTACHMENT ERROR:", err);
    res.status(500).json({ message: "Failed to delete attachment" });
  }
});






module.exports = router;
