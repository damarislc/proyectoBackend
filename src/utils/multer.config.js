import multer from "multer";
import __dirname from "../utils.js";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";
    if (file.fieldname === "profile") {
      folder = "profiles";
    } else if (file.fieldname === "product") {
      folder = "products";
    } else {
      folder = "documents";
    }

    const uploadFolder = `public/uploads/${req.params.uid}/${folder}`;

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    console.log("uploadfolder=", uploadFolder);

    cb(null, uploadFolder);
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
  { name: "profile", maxCount: 1 },
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
