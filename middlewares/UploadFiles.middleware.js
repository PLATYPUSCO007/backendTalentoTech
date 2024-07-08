const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Destination: ", req.folder);
        cb(null, `./uploads/${req.folder}/`);
    },
    filename: (req, file, cb) => {
        cb(null, `file-${Date.now()}-${file.originalname}`);
    },
});

const uploads = multer({ storage });

module.exports = uploads.single("file0");
