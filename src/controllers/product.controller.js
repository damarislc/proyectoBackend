import { productService } from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export default class ProductController {
  constructor() {
    this.productService = productService;
  }

  getProducts = (req, res) => {
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

    const user = jwt.decode(req.cookies[config.tokenCookieName]);

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
        return res.status(500).json({
          success: false,
          error: "Error al obtener los productos, " + error,
        });
      });
  };

  createProduct = (req, res) => {
    //Obtiene el json del product desde el body
    const product = req.body;
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      return res.status(402).send({
        success: false,
        message:
          "Los campos title, description, code, price, stock y category son requeridos.",
      });
    }
    //Llama el método addProduct para añadir el producto a la colección
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.productService
      .createProduct(product)
      .then((result) =>
        res.status(201).send({ success: true, payload: result })
      )
      .catch((error) =>
        res.status(500).send({
          success: false,
          message: "Error al añadir el producto, " + error,
        })
      );
  };

  getProductById = (req, res) => {
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
          res.status(404).send({
            success: false,
            message: `El producto con el id ${pid} no existe.`,
          });
        }
      })
      .catch((error) =>
        res.status(500).send({
          success: false,
          message: "Error al obtener el producto, " + error,
        })
      );
  };

  updateProduct = (req, res) => {
    //Obtiene el id de prodcuto a actualizar y el json de los campos actualizados
    const pid = req.params.pid;
    const product = req.body;
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
          res.status(404).send({
            success: false,
            message: `El producto con el id ${pid} no existe.`,
          });
        }
      })
      .catch((error) =>
        res.status(500).send({
          success: false,
          message: "Error al actualizar el producto, " + error,
        })
      );
  };

  deleteProduct = (req, res) => {
    //Obtiene el id del producto desde el params
    const pid = req.params.pid;
    //Llama el método deleteProduct con el id del producto a eliminar
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.productService
      .deleteProduct(pid)
      .then((product) => {
        if (product) {
          res.status(201).send({ success: true, payload: product });
        } else {
          res.status(404).send({
            success: false,
            message: `El producto con el id ${pid} no existe.`,
          });
        }
      })
      .catch((error) =>
        res.status(500).send({
          success: false,
          message: "Error al eliminar el producto, " + error,
        })
      );
  };
}
