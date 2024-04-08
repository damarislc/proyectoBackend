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
    const params = req.query;
    const user = req.user;

    //y se crea un url params para añadirse a la url
    const urlParams = new URLSearchParams(params);

    //se concatena la url con el url params
    const url = `http://localhost:8080/api/products?${urlParams.toString()}`;

    //se llama al fetch con la url completa
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        //si la data contiene el estatus success
        if (data.success) {
          //se renderea la vista de productos
          res.render("products", {
            data,
            title: "Listado de productos",
            user,
          });
        } else {
          //sino, se manda que hubo un error en el servidor
          res.status(500).send("Error al obtener los productos");
        }
      })
      .catch((err) =>
        res.status(500).send(`Error en el fetch de productos. ${err}`)
      );

    /*  let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    let sort = req.query.sort;
    let status = req.query.status;
    let category = req.query.category;
    limit = limit ? limit : 10;
    page = page ? page : 1;
    if (sort) sort = parseInt(sort) == -1 ? "desc" : "asc";

    //Se guardan en un objeto params
    const params = {
      limit,
      page,
    };

    if (status) params.status = status;
    if (category) params.category = category;
    if (sort) params.sort = sort;

    //y se crea un url params para añadirse a la url
    const urlParams = new URLSearchParams(params);

    //se concatena la url con el url params
    const url = `http://localhost:8080/api/products?${urlParams.toString()}`;

    //se llama al fetch con la url completa
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        //si la data contiene el estatus success
        if (data.status === "success") {
          //se renderea la vista de productos
          res.render("products", {
            data,
            title: "Listado de productos",
            user,
          });
        } else {
          //sino, se manda que hubo un error en el servidor
          res.status(500).send("Error al obtener los productos");
        }
      })
      .catch((err) =>
        res.status(500).send(`Error en el fetch de productos. ${err}`)
      ); */
  };

  renderCart = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      return res.redirect("/login");
    }
    //Se obtiene el id del carrito
    const cid = req.params.cid;
    //y se hace un fetch del carrito
    fetch(`http://localhost:8080/api/carts/${cid}`)
      .then((res) => res.json())
      .then((data) => {
        //si la data contiene el estatus success
        if (data.success) {
          const products = data.payload.products;
          //se renderea la vista del carrito
          res.render("carts", { products, title: "Carrito" });
        } else {
          //sino, se manda que hubo un error en el servidor
          res.status(500).send("Error al obtener el carrito");
        }
      })
      .catch((err) =>
        res.status(500).send(`Error en el fetch de carrito. ${err}`)
      );
  };
}
