import { userService } from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export default class UserController {
  constructor() {
    this.userService = userService;
  }

  getCurrentUser = async (req, res) => {
    const userToken = jwt.decode(req.cookies[config.tokenCookieName]);
    const user = await userService.getUserByEmail(userToken.email);
    res.send(user);
  };

  getUsers = async (req, res, next) => {
    try {
      const users = await this.userService.getUsers();
      res.send(users);
    } catch (error) {
      req.logger.error(error);
      next(error);
    }
  };

  createUser = async (req, res, next) => {
    try {
      const { name, lastname, age, email } = req.body;
      const result = await this.userService.createUser({
        name,
        lastname,
        age,
        email,
      });
      res.status(201).send({ success: true, payload: result });
    } catch (error) {
      req.logger.error(error);
      next(error);
    }
  };

  updateUserRole = async (req, res, next) => {
    const uid = req.params.uid;
    const { role } = req.body;
    this.userService
      .updateUserRole(uid, role)
      .then((user) => {
        if (user) {
          res.status(201).send({
            success: true,
            message: "Usuario actualizado correctamante",
          });
        } else {
          const err = new CustomError(
            "Error actualizando el usuario",
            `El usuario no existe.`,
            "Error al buscar el usuario",
            EErrors.NOT_FOUND
          );
          return next(err);
        }
      })
      .catch((error) => {
        req.logger.error(error);
        next(error);
      });
  };

  deleteUser = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await this.userService.deleteUser(email);
      res.status(201).send({ success: true, payload: result });
    } catch (error) {
      req.logger.error(error);
      next(error);
    }
  };
}
