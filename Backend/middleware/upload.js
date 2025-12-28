import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure base upload directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

// Storage for property uploads (photos/videos)
const propertyStorage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = "properties";
    const uploadPath = `uploads/${folder}`;
    
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

// Storage for profile pictures (directly in uploads/)
const profileStorage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = "uploads";
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const uniqueName = `profile-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
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

// Image-only filter for profile pictures
const imageOnlyFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedImageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  
  if (allowedImageExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPG, JPEG, PNG, WebP, GIF) are allowed for profile pictures"), false);
  }
};

// Default upload for properties
const upload = multer({ 
  storage: propertyStorage, 
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max file size
  }
});

// Upload for profile pictures
export const uploadProfile = multer({ 
  storage: profileStorage, 
  fileFilter: imageOnlyFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max for profile pictures
  }
});

export default upload;




