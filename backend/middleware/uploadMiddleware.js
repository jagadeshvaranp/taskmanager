const multer = require("multer");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filter the images
const filefilter = (req, file, cb) => {
  const allowtype = ["image/png", "image/jpeg", "image/jpg"];

  if (allowtype.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, jpg, png formats are allowed"), false);
  }
};

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: filefilter
});

module.exports = upload;
