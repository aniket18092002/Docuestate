const mongoose = require("mongoose");

const propertyAttachmentSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
        },

        file: {
            type: String, // file path / filename
            required: true,
        },

        remarks: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "PropertyAttachment",
    propertyAttachmentSchema
);
