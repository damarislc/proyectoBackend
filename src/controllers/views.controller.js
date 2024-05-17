import { userService } from "../services/index.js";
import config from "../config/config.js";
import { products } from "../utils.js";
import UserDTO from "../dto/user.dto.js";

export default class ViewsController {
  constructor() {
    this.userService = userService;
  }
  renderInicio = (req, res) => {
    res.redirect("/login");
  };

  renderChat = (req, res) => {
    res.render("chat", { title: "Chat" });
  };

  renderLogin = (req, res) => {
    res.render("login", { title: "Login" });
  };

  renderRegister = (req, res) => {
    res.render("register", { title: "Registro" });
  };

  renderRestore = (req, res) => {
    res.render("restore");
  };

  renderTokenExpired = (req, res) => {
    res.render("tokenExpired");
  };

  renderCurrent = async (req, res) => {
    if (req.cookies[config.tokenCookieName]) {
      const user = await this.userService.getUserByEmail(req.user.email);
      const userDto = new UserDTO(user);
      //se manda el usuario que se obtuvo en el passportCall de JWT a la vista current
      res.render("current", { title: "Perfil de usuario", user: userDto });
    } else {
      req.logger.info("Token invalido");
      res.status(401).json({
        error: "Invalid jwt",
      });
    }
  };

  renderUpdate = async (req, res) => {
    if (req.cookies[config.tokenCookieName]) {
      //se manda el usuario que se obtuvo en el passportCall de JWT a la vista current
      const user = await this.userService.getUserByEmail(req.user.email);
      res.render("update", {
        title: "Actualizar role del usuario",
        user: user,
      });
    } else {
      req.logger.info("Token invalido");
      res.status(401).json({
        error: "Invalid jwt",
      });
    }
  };

  renderProducts = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      req.logger.info("Token invalido");
      return res.redirect("/login");
    }

    const user = req.user;
    res.render("products", {
      title: "Listado de productos",
      user,
    });
  };

  renderProductsMockup = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      return res.redirect("/login");
    }

    const user = req.user;
    res.render("productsMockup", {
      title: "Listado de productos",
      user,
      products,
    });
  };

  renderProduct = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      req.logger.info("Token invalido");
      return res.redirect("/login");
    }

    res.render("edit", {
      title: "Editar producto",
    });
  };

  renderCreate = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      req.logger.info("Token invalido");
      return res.redirect("/login");
    }

    res.render("create", {
      title: "Crear producto",
    });
  };

  renderCart = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      req.logger.info("Token invalido");
      return res.redirect("/login");
    }

    res.render("carts", {
      title: "Mi carrito",
    });
  };
}
