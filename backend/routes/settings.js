const express = require("express");
const router = express.Router();
const Setting = require("../models/settings");
const upload = require("../utils/upload");

/* =========================
   GET SETTINGS (Singleton)
========================= */
router.get("/", async (req, res) => {
  try {
    const setting = await Setting.findOne();
    res.json(setting);
  } catch (err) {
    console.error("GET SETTINGS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   CREATE / UPDATE SETTINGS
========================= */
router.post(
  "/",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "homeBanner", maxCount: 1 },
    { name: "whyImages", maxCount: 4 },
  ]),
  async (req, res) => {
    try {
      const existingSetting = await Setting.findOne();
      const updateData = {};

      /* ========= BASIC ========= */
      if (req.body.siteName !== undefined) {
        updateData.siteName = req.body.siteName;
      }

      /* ========= LOGO ========= */
      if (req.files?.logo?.length) {
        updateData.logo = `/uploads/settings/logo/${req.files.logo[0].filename}`;
      }

      /* ========= HOME BANNER ========= */
      if (req.files?.homeBanner?.length) {
        updateData.homeBanner = `/uploads/settings/homeBanner/${req.files.homeBanner[0].filename}`;
      }

      /* ========= WHY CHOOSE US ========= */
      const existingWhy = existingSetting?.whyChooseUs || {};

      updateData.whyChooseUs = {
        title: req.body.whyTitle ?? existingWhy.title ?? "",
        description: req.body.whyDescription ?? existingWhy.description ?? "",
        points: safeParseArray(req.body.whyPoints, existingWhy.points),
        images: req.files?.whyImages?.length
          ? req.files.whyImages.map(
            (img) => `/uploads/settings/whyImages/${img.filename}`
          )
          : existingWhy.images ?? [],
      };

      /* ========= ABOUT ========= */
      updateData.about = {
        title: req.body.aboutTitle ?? existingSetting?.about?.title ?? "",
        description:
          req.body.aboutDescription ??
          existingSetting?.about?.description ??
          "",
      };

      /* ========= FOOTER WEB ========= */
      const existingFooter = existingSetting?.footerWeb || {};
      updateData.footerWeb = {
        address:
          req.body.footerWebAddress ??
          existingFooter.address ??
          "",

        email:
          req.body.footerWebEmail ??
          existingFooter.email ??
          "",

        description:
          req.body.footerWebDescription ??
          existingFooter.description ??
          "",

        phone:
          req.body.footerWebPhone ??
          existingFooter.phone ??
          "",

        copyright:
          req.body.footerWebCopyright ??
          existingFooter.copyright ??
          "",

        properties: safeParseArray(
          req.body.footerWebProperties,
          existingFooter.properties
        ),

        cities: safeParseArray(
          req.body.footerWebCities,
          existingFooter.cities
        ),
      };

      /* ========= UPSERT ========= */
      const setting = await Setting.findOneAndUpdate(
        {},
        { $set: updateData },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      res.json(setting);
    } catch (err) {
      console.error("SETTINGS SAVE ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* =========================
   SAFE JSON PARSER
========================= */
function safeParseArray(value, fallback = []) {
  try {
    if (typeof value === "string") {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

module.exports = router;
