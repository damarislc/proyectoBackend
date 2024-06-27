import { productService, userService } from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import CustomError from "../services/errors/CustomError.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";
import { sendMail } from "../utils/sendMail.js";

export default class ProductController {
  constructor() {
    this.productService = productService;
    this.userService = userService;
  }

  getProducts = async (req, res, next) => {
    //se obtiene los parametros
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    let sort = parseInt(req.query.sort);
    let status = req.query.status;
    let category = req.query.category;
    //se asigna un limite por default
    limit = limit ? limit : 10;
    //se asigna una pagina por default
    page = page ? page : 1;
    if (sort) sort = sort == -1 ? "desc" : "asc";

    //se guardan los parametros en un objeto
    const params = {
      limit,
      page,
      sort,
      status,
      category,
    };

    const userToken = jwt.decode(req.cookies[config.tokenCookieName]);

    let user;
    try {
      user = await this.userService.getUserByEmail(userToken.email);
    } catch (error) {
      req.logger.error(error);
      return next(error);
    }
    //Llama el método getProducts
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.productService
      .getProducts(params)
      .then((products) => {
        //se manda el respond con las propiedades del paginate
        return res.status(201).json({
          success: true,
          payload: products.docs,
          user: user,
          totalPages: products.totalPages,
          prevPage: products.prevPage,
          nextPage: products.nextPage,
          page: products.page,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevLink: products.hasPrevPage
            ? `/products?page=${products.prevPage}`
            : null,
          nextLink: products.hasNextPage
            ? `/products?page=${products.nextPage}`
            : null,
        });
      })
      .catch((error) => {
        req.logger.error(error);
        return next(error);
      });
  };

  createProduct = (req, res, next) => {
    //Obtiene el json del product desde el body
    const product = req.body;
    const user = jwt.decode(req.cookies[config.tokenCookieName]);
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      const err = new CustomError(
        "Error creando el producto",
        generateProductErrorInfo(product),
        "Error al intentar crear el producto",
        EErrors.OUT_OF_STOCK
      );
      return next(err);
    }
    product.owner = user.email;
    //Llama el método addProduct para añadir el producto a la colección
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.productService
      .createProduct(product)
      .then((result) =>
        res.status(201).send({ success: true, payload: result })
      )
      .catch((error) => {
        req.logger.error(error);
        next(error);
      });
  };

  getProductById = (req, res, next) => {
    //Obtiene el id del producto desde el params
    const pid = req.params.pid;
    //Llama el método getProductById para obtener el producto según su id
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.productService
      .getProductById(pid)
      .then((product) => {
        if (product) {
          res.status(201).send({ success: true, payload: product });
        } else {
          const err = new CustomError(
            "Error buscando el producto",
            `El producto con el id ${pid} no existe.`,
            "Error al buscar el producto",
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

  updateProduct = async (req, res, next) => {
    //Obtiene el id de prodcuto a actualizar y el json de los campos actualizados
    const pid = req.params.pid;
    const product = req.body;

    const user = jwt.decode(req.cookies[config.tokenCookieName]);
    //primero se verifica si el usuario puede modificar el producto
    const userEmail = String(user.email).toLowerCase();
    if (userEmail !== "admincoder@coder.com") {
      const productDB = await this.productService.getProductById(pid);

      if (userEmail !== String(productDB.owner).toLowerCase()) {
        const err = new CustomError(
          "No se puede actualizar el producto",
          `No tiene autorización para modificar este producto`,
          "Error al actualizar el producto",
          EErrors.NO_ACCESS
        );
        return next(err);
      }
    }

    //Llama el método updateProduct con el id del producto y los nuevos campos
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.productService
      .updateProduct(pid, product)
      .then((product) => {
        if (product) {
          res.status(201).send({
            success: true,
            payload: product,
          });
        } else {
          const err = new CustomError(
            "Error buscando el producto",
            `El producto con el id ${pid} no existe.`,
            "Error al buscar el producto",
            EErrors.NOT_FOUND
          );
          req.logger.error("Sin permiso para modificar");
          return next(err);
        }
      })
      .catch((error) => {
        req.logger.error(error);
        next(error);
      });
  };

  disableProduct = async (req, res, next) => {
    //Obtiene el id del producto desde el params
    const pid = req.params.pid;

    const user = jwt.decode(req.cookies[config.tokenCookieName]);
    //primero se verifica si el usuario puede modificar el producto
    const userEmail = String(user.email).toLowerCase();
    if (userEmail !== "admincoder@coder.com") {
      const productDB = await this.productService.getProductById(pid);

      if (userEmail !== String(productDB.owner).toLowerCase()) {
        req.logger.debug("No tiene autorizacion para deshabilitar producto");
        const err = new CustomError(
          "No se pudo deshabilitar el producto",
          `No tiene autorización para deshabilitar este producto`,
          "Error al actualizar el producto",
          EErrors.NO_ACCESS
        );
        return next(err);
      }
    }

    //Llama el método deleteProduct con el id del producto a eliminar
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.productService
      .disableProduct(pid)
      .then((product) => {
        if (product) {
          res.status(201).send({ success: true, payload: product });
        } else {
          const err = new CustomError(
            "Error buscando el producto",
            `El producto con el id ${pid} no existe.`,
            "Error al buscar el producto",
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

  deleteProduct = async (req, res, next) => {
    //Obtiene el id del producto desde el params
    const pid = req.params.pid;

    const user = jwt.decode(req.cookies[config.tokenCookieName]);
    //primero se verifica si el usuario puede modificar el producto
    const userEmail = String(user.email).toLowerCase();
    if (userEmail !== "admincoder@coder.com") {
      const productDB = await this.productService.getProductById(pid);

      if (userEmail !== String(productDB.owner).toLowerCase()) {
        req.logger.debug("No tiene autorizacion para eliminar producto");
        const err = new CustomError(
          "No se puedo eliminar el producto",
          `No tiene autorización para eliminar este producto`,
          "Error al eliminar el producto",
          EErrors.NO_ACCESS
        );
        return next(err);
      }
    }

    //Llama el método deleteProduct con el id del producto a eliminar
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.productService
      .deleteProduct(pid)
      .then((product) => {
        if (product) {
          const productContent = {
            title: product.title,
            email: product.owner,
          };
          this.emailUserDeletedProduct(req, productContent);
          res
            .status(201)
            .send({ success: true, deleted: true, payload: product });
        } else {
          const err = new CustomError(
            "Error buscando el producto",
            `El producto con el id ${pid} no existe.`,
            "Error al buscar el producto",
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

  emailUserDeletedProduct = async (req, productContent) => {
    const subject = `Su producto ${productContent.title} ha sido eliminado`;
    const html = `
    <p>Hola,</p> 
    <p>Su producto ${productContent.title} ha sido eliminado de la tienda.</p>
    <p>Si usted no ha eliminado el producto o necesita una aclaración de porque se ha eliminado, favor de mandar correo a <a href="mailto:help@api.com">Servicio al cliente</a></p>
    <p>Attentamente: El admin</p> `;
    const mailConfig = {
      to: productContent.email,
      subject,
      html,
    };
    try {
      const result = await sendMail(mailConfig);
      req.logger.info("Correo enviado");
    } catch (error) {
      req.logger.error("Error al enviar el correo: " + error);
    }
  };
}
