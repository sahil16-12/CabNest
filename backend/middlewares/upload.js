import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Folder where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb(new Error("Only images (JPEG, JPG, PNG) are allowed!"), false);
    }
};

// Multer upload settings
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: fileFilter,
});

export default upload;
