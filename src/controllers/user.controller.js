import { userService } from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

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
    const user = await userService.getUser(uid);
    const { role } = req.body;
    if (user.role === "user" && role === "premium") {
      const documents = user.documents.map((document) => document.name);
      if (
        !documents.includes("identification") ||
        !documents.includes("address") ||
        !documents.includes("bankaccount")
      ) {
        const err = new CustomError(
          "Faltan documentos",
          `No se puede cambiar a premium ya que no ha subidos todos los documentos necesarios.`,
          "Error al cambiar el role",
          EErrors.MISSING_FILES
        );
        return next(err);
      }
    }
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

  uploadDocuments = async (req, res, next) => {
    try {
      const { uid } = req.params;
      const files = req.files;

      if (!files) {
        const err = new CustomError(
          "Error actualizando el usuario",
          `Faltan archivos requeridos.`,
          "Error al subir los archivos",
          EErrors.NOT_FOUND
        );
        return next(err);
      }

      const user = await userService.getUser(uid);
      if (!user) {
        const err = new CustomError(
          "Error actualizando el usuario",
          `El usuario no existe.`,
          "Error al buscar el usuario",
          EErrors.NOT_FOUND
        );
        return next(err);
      }

      user.documents = user.documents || [];

      Object.keys(files).forEach((fileKey) => {
        const filesArray = files[fileKey];
        filesArray.forEach((file) => {
          user.documents.push({
            name: fileKey,
            reference: `${file.destination}/${file.filename}`,
          });
        });
      });

      let result = await user.save();
      res.status(201).send({ success: true, payload: result });
    } catch (error) {
      req.logger.error(error);
      console.error(error);
      next(error);
    }
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
