import { Router } from "express";
import UserController from "../../controllers/user.controller.js";

const router = Router();
const { getUsers, createUser } = new UserController();

router.get("/", getUsers);

router.post("/", createUser);

export default router;
