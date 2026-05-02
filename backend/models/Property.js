const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // owner: {
    //   type: String,
    //   required: true,
    // },

    listingId: {
      type: String,
      unique: true,
    },

    propertyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyType",
      required: true,
    },

    // area: {
    //   type: String,
    //   required: true,
    // },

    // area: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   type: String,
    //   ref: "LocationMaster", // or AreaMaster
    //   default: null,
    // },

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocationMaster",
      default: null,
    },
    postcode: {
      type: String,
      required: true,
    },

    rent: {
      type: Number,
      required: true,
    },

    deposit: {
      type: Number,
    },

    bedrooms: {
      type: String,
    },

    bathrooms: {
      type: Number,
    },

    furnishing: {
      type: String,
    },

    availableFrom: {
      type: Date,
    },

    leaseType: {
      type: String,
    },

    epcRating: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Live", "Inactive", "Rejected"]
      // default: "Pending",
    },
    property_listed: {
      type: String,
      enum: ["0", "1"],
      default: "1",
    },

    views: {
      type: Number,
      default: 0,
    },

    featured_image: {
      type: String,
      default: null,
    },
    attachments: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        file: String,
        remarks: String,
      },
    ],

    saves: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
