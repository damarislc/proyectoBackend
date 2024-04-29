import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { cartService } from "../services/index.js";

export default class CartController {
  constructor() {
    this.cartService = cartService;
  }

  createCart = (req, res, next) => {
    //Llama el método addCart para crear el carrito
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.cartService
      .createCart()
      .then((cart) => res.send({ success: true, payload: cart }))
      .catch((error) => next(error));
  };

  getCart = (req, res, next) => {
    //obtiene el id del carrito desde el params
    const cid = req.params.cid;
    //Llamda el método getCart para obtener los productos del carrito correspondiente
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.cartService
      .getCart(cid)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => next(error));
  };

  addProductToCart = (req, res, next) => {
    //Obtiene el id del carrito y del producto desde el params
    const cid = req.params.cid;
    const pid = req.params.pid;
    //Llama el método addProductCart para añadir el producto al carrito
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.cartService
      .addProductToCart(cid, pid)
      .then((result) => {
        if (result) res.send({ success: true, payload: result });
        else {
          const err = new CustomError(
            "Error al añadir el producto al carrito",
            "Producto no disponible",
            "Error al añadir el producto por falta de disponibilidad",
            EErrors.OUT_OF_STOCK
          );
          return next(err);
        }
      })
      .catch((error) => next(error));
  };

  deleteProductFromCart = (req, res, next) => {
    //Obtiene el id del carrito y del producto desde el params
    const cid = req.params.cid;
    const pid = req.params.pid;
    this.cartService
      .deleteProductFromCart(cid, pid)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => next(error));
  };

  updateCart = (req, res, next) => {
    const cid = req.params.cid;
    const products = req.body;
    this.cartService
      .updateCart(cid, products)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => next(error));
  };

  updateProductQuantity = (req, res, next) => {
    //Obtiene el id del carrito y del producto desde el params
    const cid = req.params.cid;
    const pid = req.params.pid;
    //Obtiene el quantity desde el body
    const quantity = req.body.quantity;
    //Llama el método addProductCart para añadir el producto al carrito
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.cartService
      .updateProductQuantity(cid, pid, quantity)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => next(error));
  };

  deleteAllProductsFromCart = (req, res, next) => {
    //Obtiene el id del carrito desde el params
    const cid = req.params.cid;
    this.cartService
      .deleteAllProductsFromCart(cid)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => next(error));
  };
}
