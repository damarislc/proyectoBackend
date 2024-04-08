import express from "express";
import CartController from "../../controllers/cart.controller.js";

const router = express.Router();
//crea una instancia del CartManager
const {
  createCart,
  getCart,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteAllProductsFromCart,
} = new CartController();

//Crear carrito
router.post("/", createCart);

//Obtener productos del carrito
router.get("/:cid", getCart);

//Añadir producto al carrito
router.post("/:cid/product/:pid", addProductToCart);

//Borrar un producto del carrito
router.delete("/:cid/product/:pid", deleteProductFromCart);

/**
 * Actualizar carrito con un arreglo de productos
 * el formato del arreglo debe ser [{id: id, quantity: n}]
 */
router.put("/:cid", updateCart);

//Modificar cantidad del producto en el carrito
router.put("/:cid/product/:pid", updateProductQuantity);

router.delete("/:cid", deleteAllProductsFromCart);

export default router;
