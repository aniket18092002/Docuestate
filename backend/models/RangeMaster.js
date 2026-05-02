const mongoose = require("mongoose");

const RangeMasterSchema = new mongoose.Schema(
    {
        Range_name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("RangeMaster", RangeMasterSchema);