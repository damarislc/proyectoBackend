import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { userService } from "../services/index.js";
import { createHash, isValidPassword } from "../utils.js";
import { sendMail } from "../utils/sendMail.js";

export default class SessionsController {
  constructor() {
    this.userService = userService;
  }

  register = (req, res, next) => {
    res.status(200).send({
      success: true,
      message: "Usuario creado correctamente",
    });
  };

  login = (req, res, next) => {
    //Si la autenticacion fue correcta, se crea el token del usuario
    //para ello creamos un objeto con la informacion que queremos almacenar del usuario
    const userToken = {
      name: req.user.name,
      lastname: req.user.lastname,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };
    //creamos el token
    const token = jwt.sign(userToken, config.privateKey, {
      expiresIn: "24h",
    });

    req.logger.debug("Token creado");

    //guardamos el token en una cookie con httpOnly true y mandamos la respuesta
    res
      .cookie(config.tokenCookieName, token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .send({
        success: true,
      });
  };

  logout = (req, res) => {
    if (req.cookies[config.tokenCookieName]) {
      res.clearCookie(config.tokenCookieName).status(200).json({
        success: true,
        message: "You have logged out",
      });
    } else {
      res.status(401).json({
        error: "Invalid jwt",
      });
      req.logger.debug(
        `Invalid jwt token ${req.cookies[config.tokenCookieName]}`
      );
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await this.userService.getUserByEmail(email);
      if (!user)
        return res
          .status(400)
          .send({ success: false, message: "El usuario no existe" });
      const userToken = {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart,
      };
      req.logger.debug(userToken);
      //creamos el token
      const token = jwt.sign(userToken, config.privateKey, {
        expiresIn: "1h",
      });
      const subject = "Restablecer contraseña";
      const html = `
                    <p>Hola ${user.name},</p>
                    <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                    <p>Si tú no enviaste la solicitud, ignora este mensaje. De lo contrario, puedes restablecer tu constraseña haciendo clic en el siguiente enlace:</p>
                    <a href="http://localhost:8080/api/sessions/reset-password/${token}">Restablece tu contraseña</a>
                    <p>El enlace expirará en 1 hora.</p>`;
      //send mail
      const mailConfig = {
        to: user.email,
        subject,
        html,
      };
      const result = await sendMail(mailConfig);
      req.logger.info("Correo enviado");
      return res.status(200).send({
        success: true,
        message:
          "Se ha enviado el enlace de recuperación a su correo electrónico.",
      });
    } catch (error) {
      req.logger.error("Error al restablecer contraseña: " + error);
      return res.status(500).send({
        success: false,
        message: `Error al restablecer contraseña. ${error}`,
      });
    }
  };

  resetPasswordToken = async (req, res) => {
    try {
      const { token } = req.params;
      const decodedUser = jwt.verify(token, config.privateKey);

      if (!decodedUser) {
        res.render("tokenExpired", { title: "Token expirado" });
      }

      res.render("restore", { token, title: "Restaurar contraseña" });
    } catch (error) {
      res.render("tokenExpired", { title: "Token expirado" });
    }
  };

  restore = async (req, res) => {
    try {
      const { passwordNew, passwordConfirm, token } = req.body;
      if (!passwordNew || !passwordConfirm || passwordNew !== passwordConfirm)
        return res.status(400).send({
          success: false,
          message: "La contraseña no puede estar vacía y deben de coincidir.",
        });

      const decodedUser = jwt.verify(token, config.privateKey);

      if (!decodedUser)
        return res.status(400).send({
          success: false,
          message: "El token no es válido o ha expirado.",
        });

      const user = await this.userService.getUserByEmail(decodedUser.email);

      if (!user)
        return res.status(400).send({
          success: false,
          message: "El usuario no existe.",
        });

      const previousPassword = isValidPassword(user, passwordNew);
      if (previousPassword)
        return res.status(400).send({
          success: false,
          message: "La contraseña no puede ser la misma que la anterior.",
        });

      user.password = createHash(passwordNew);

      await this.userService.updatePassword(user);

      //manda un mensaje exitoso
      res.status(200).send({
        success: true,
        message: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: `Error al restablecer contraseña. ${error}`,
      });
    }
  };
}
