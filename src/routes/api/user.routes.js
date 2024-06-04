import { Router } from "express";
import UserController from "../../controllers/user.controller.js";

const router = Router();
const { getCurrentUser, getUsers, createUser, updateUserRole, deleteUser } =
  new UserController();

router.get("/", getCurrentUser);
//router.get("/", getUsers);

router.post("/", createUser);

router.put("/premium/:uid", updateUserRole);

router.delete("/", deleteUser);

export default router;
