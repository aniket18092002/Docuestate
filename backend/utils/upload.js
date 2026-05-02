const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = "uploads";

        if (file.fieldname === "logo") {
            uploadPath = "uploads/settings/logo";
        } else if (file.fieldname === "homeBanner") {
            uploadPath = "uploads/settings/homeBanner";
        } else if (file.fieldname === "whyImages") {
            uploadPath = "uploads/settings/whyImages";
        }

        //  Create folder if not exists
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

module.exports = upload;
