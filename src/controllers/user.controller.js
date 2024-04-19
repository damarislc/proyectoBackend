import { userService } from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export default class UserController {
  constructor() {
    this.userService = userService;
  }

  getCurrentUser = (req, res) => {
    const user = jwt.decode(req.cookies[config.tokenCookieName]);
    res.send(user);
  };

  getUsers = async (req, res) => {
    try {
      const users = await this.userService.getUsers();
      res.send(users);
    } catch (error) {
      console.log(error);
    }
  };

  createUser = async (req, res) => {
    try {
      const { name, lastname, email } = req.body;
      const result = await this.userService.createUser({
        name,
        lastname,
        email,
      });
      res.status(201).send({ success: true, payload: result });
    } catch (error) {
      console.log(error);
    }
  };
}
