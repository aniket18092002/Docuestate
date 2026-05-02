const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
    {
        siteName: {
            type: String,
            default: "DocuEstate",
        },

        logo: {
            type: String,
            default: null,
        },

        homeBanner: {
            type: String,
            default: null,
        },


        whyChooseUs: {
            title: String,
            description: String,
            images: [String],   // ✅ 4 images
            points: [String],   // ✅ bullet points
        },


        about: {
            title: String,
            description: String,
        },

        footerWeb: {
            address: { type: String, default: "" },
            email: { type: String, default: "" },
            description: { type: String, default: "" },
            phone: { type: String, default: "" },
            copyright: { type: String, default: "" },
            properties: { type: [String], default: [] },
            cities: { type: [String], default: [] },
        },
     
    },
    { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
