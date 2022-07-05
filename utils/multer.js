import multer from "multer";
import path from "path";

//Multer config
export default upload({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type not supported"), false);
      return;
    }
    cb(null, true);
  },
});
