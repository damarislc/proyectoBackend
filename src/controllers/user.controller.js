import { userService } from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { sendMail } from "../utils/sendMail.js";

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
    console.log("backend, getusers");
    try {
      const users = await this.userService.getUsers();
      console.log("users=", users);
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

  /**
   * Borra los usuarios inactivos
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteInactives = async (req, res, next) => {
    try {
      //Obtiene todos los usuarios
      const users = await this.userService.getUsers();
      //arreglo en el que se iran guardando los usuarios inactivos
      const inactiveUsers = [];
      //Por cada uno de los usuarios obtenidos se compara la fecha de conexion
      users.forEach(async (user) => {
        const date = new Date();
        let date1 = date.getTime();
        //Si no tiene una ultima conexion porque no se ha logueado, se pasa al siguiente
        if (!user.last_connection || user.email === "adminCoder@coder.com")
          return;
        //se obtiene la ultima conexion del usuario
        let date2 = user.last_connection.getTime();

        let difference_in_time = date1 - date2;
        //se obtiene la diferencia en min por cuestion de testing
        let difference_in_days = Math.round(
          difference_in_time / (1000 * 60) //(1000 * 36000 * 24)
        );

        //Para testing, el tiempo de espera es de 30 min de inactividad
        if (difference_in_days > 30) {
          inactiveUsers.push(user);
          await this.userService.deleteUser(user.email);
        }
      });
      console.log("InactiveUsers=", inactiveUsers);
      this.emailInactives(req, inactiveUsers);

      res
        .status(200)
        .send({ success: true, message: "Usuarios inactivos eliminados" });
    } catch (error) {
      res.status(500).send({
        succes: false,
        error: "Error al eliminar los usuarios inactivos. " + error,
      });
    }
  };

  emailInactives = (req, inactiveUsers) => {
    const subject = "Usuario eliminado por inactividad";
    inactiveUsers.forEach(async (user) => {
      const html = `
                  <p>Hola ${user.name}</p>
                  <p>Su usario con el email ${user.email} ha sido eliminado de la aplicación debido a su inactividad.</p>
                  <p>Disculpe las molestias que esto pueda ocasionar, si quieire seguir haciendo uso de la plataforma, favor de registrase nuevamente.</p>
                  <p>Attentamente: La administación</p>`;
      const mailConfig = {
        to: user.email,
        subject,
        html,
      };
      try {
        const result = await sendMail(mailConfig);
        req.logger.info("Correo enviado");
      } catch (error) {
        req.logger.error("Error al enviar el correo: " + error);
      }
    });
  };
}
