import multer from "multer";
import path from "path";

// Multer config

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname);
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    cb(new Error("File type is not supported"), false); //false means "accept the image"
    return;
  }
  cb(null, true); //true means "accept the image"
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });
