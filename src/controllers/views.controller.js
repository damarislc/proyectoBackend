import config from "../config/config.js";
import ProductController from "./product.controller.js";

export default class ViewsController {
  constructor() {
    this.productController = new ProductController();
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

  renderCurrent = (req, res) => {
    if (req.cookies[config.tokenCookieName]) {
      //se manda el usuario que se obtuvo en el passportCall de JWT a la vista current
      res.render("current", { title: "Perfil de usuario", user: req.user });
    } else {
      res.status(401).json({
        error: "Invalid jwt",
      });
    }
  };

  renderProducts = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      return res.redirect("/login");
    }

    const user = req.user;
    res.render("products", {
      title: "Listado de productos",
      user,
    });
  };

  renderProduct = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      return res.redirect("/login");
    }

    res.render("edit", {
      title: "Editar producto",
    });
  };

  renderCreate = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      return res.redirect("/login");
    }

    res.render("create", {
      title: "Crear producto",
    });
  };

  renderCart = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      return res.redirect("/login");
    }

    res.render("carts", {
      title: "Mi carrito",
    });
  };
}
