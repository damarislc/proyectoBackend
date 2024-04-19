import { cartService } from "../services/index.js";

export default class CartController {
  constructor() {
    this.cartService = cartService;
  }

  createCart = (req, res) => {
    //Llama el método addCart para crear el carrito
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.cartService
      .createCart()
      .then((cart) => res.send({ success: true, payload: cart }))
      .catch((error) => res.send({ status: "error", error: error }));
  };

  getCart = (req, res) => {
    //obtiene el id del carrito desde el params
    const cid = req.params.cid;
    //Llamda el método getCart para obtener los productos del carrito correspondiente
    //si la promesa es exitosa manda el resultado
    //sino manda un mensaje de error
    this.cartService
      .getCart(cid)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => res.send({ status: "error", error: error }));
  };

  addProductToCart = (req, res) => {
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
        else
          res.send({
            success: false,
            unavailable: true,
            message: "No hay disponibilidad del producto.",
          });
      })
      .catch((error) => res.send({ status: "error", error: error }));
  };

  deleteProductFromCart = (req, res) => {
    //Obtiene el id del carrito y del producto desde el params
    const cid = req.params.cid;
    const pid = req.params.pid;
    this.cartService
      .deleteProductFromCart(cid, pid)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => res.send({ status: "error", error: error }));
  };

  updateCart = (req, res) => {
    const cid = req.params.cid;
    const products = req.body;
    this.cartService
      .updateCart(cid, products)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => res.send({ status: "error", error: error }));
  };

  updateProductQuantity = (req, res) => {
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
      .catch((error) => res.send({ status: "error", error: error }));
  };

  deleteAllProductsFromCart = (req, res) => {
    //Obtiene el id del carrito desde el params
    const cid = req.params.cid;
    this.cartService
      .deleteAllProductsFromCart(cid)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => res.send({ status: "error", error: error }));
  };
}
