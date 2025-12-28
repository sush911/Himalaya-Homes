import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure base upload directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

// storage destination
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Default to 'properties' if folder not specified
    const folder = "properties";
    const uploadPath = `uploads/${folder}`;
    
    // Ensure folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// file filter (images and videos)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedImageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const allowedVideoExts = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
  
  if ([...allowedImageExts, ...allowedVideoExts].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPG, JPEG, PNG, WebP, GIF) and videos (MP4, MOV, AVI, MKV, WebM) are allowed"), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max file size
  }
});

export default upload;




