import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { userService } from "../services/index.js";
import { createHash } from "../utils.js";

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
    }
  };

  restore = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).send({
          status: "error",
          error: "Todos los campos son obligatorios",
        });

      const user = await this.userService.getUserByEmail(email);

      if (!user)
        return res
          .status(401)
          .send({ status: "error", error: "Usuario incorrecto" });

      user.password = createHash(password);

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
