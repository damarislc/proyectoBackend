import express from "express";
import CartManager from "../dao/cartManager.js";

const router = express.Router();
//crea una instancia del CartManager
const cartManager = new CartManager();

//Crear carrito
router.post("/", (req, res) => {
  //Llama el método addCart para crear el carrito
  //si la promesa es exitosa manda el resultado
  //sino manda un mensaje de error
  cartManager
    .addCart()
    .then((cart) => res.send({ status: "success", payload: cart }))
    .catch((error) => res.send({ status: "error", error: error }));
});

//Obtener productos del carrito
router.get("/:cid", (req, res) => {
  //obtiene el id del carrito desde el params
  const cid = req.params.cid;
  //Llamda el método getCart para obtener los productos del carrito correspondiente
  //si la promesa es exitosa manda el resultado
  //sino manda un mensaje de error
  cartManager
    .getCart(cid)
    .then((result) => res.send({ status: "sucess", payload: result }))
    .catch((error) => res.send({ status: "error", error: error }));
});

//Añadir producto al carrito
router.post("/:cid/product/:pid", (req, res) => {
  //Obtiene el id del carrito y del producto desde el params
  const cid = req.params.cid;
  const pid = req.params.pid;
  //Llama el método addProductCart para añadir el producto al carrito
  //si la promesa es exitosa manda el resultado
  //sino manda un mensaje de error
  cartManager
    .addProductToCart(cid, pid)
    .then((result) => res.send({ status: "succes", payload: result }))
    .catch((error) => res.send({ status: "error", error: error }));
});

export default router;
