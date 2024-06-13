import multer from "multer";
import __dirname from "../utils.js";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/public/uploads`);
  },
  filename: (req, file, cb) => {
    const { uid } = req.params;

    cb(
      null,
      `${file.fieldname}-${uid}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const uploader = multer({
  storage,
  onError: (err, next) => {
    console.error("Error en multer:", err);
    next(err);
  },
}).fields([
  { name: "identification", maxCount: 1 },
  { name: "address", maxCount: 1 },
  { name: "bankaccount", maxCount: 1 },
]);

/*
.fields([
  { name: "identification", maxCount: 1 },
  { name: "address", maxCount: 1 },
  { name: "bankaccount", maxCount: 1 },
]);
*/

export default uploader;
