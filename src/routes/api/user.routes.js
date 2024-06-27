import { Router } from "express";
import UserController from "../../controllers/user.controller.js";
import uploader from "../../utils/multer.config.js";

const router = Router();
const {
  getCurrentUser,
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
  uploadDocuments,
  deleteInactives,
} = new UserController();

router.get("/", getCurrentUser);

router.get("/all", getUsers);

router.post("/", createUser);

router.put("/premium/:uid", updateUserRole);

router.delete("/", deleteUser);

router.post("/:uid/documents", uploader, uploadDocuments);

router.delete("/inactives", deleteInactives);

export default router;
