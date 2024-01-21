import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import CartManager from "../models/cartManager.js";
import ProductManager from "../models/productManager.js";

const router = express.Router();
//Variables para obtener el directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Path de la "base de datos" (json) de productos
const cartsdb = path.join(__dirname, "../db", "carts.json");
const productsdb = path.join(__dirname, "../db", "products.json");

const cartManager = new CartManager(cartsdb);
const productManager = new ProductManager(productsdb);

router.post("/api/carts", (req, res) => {
  const cartPromise = cartManager.addCart();
  cartPromise
    .then((cart) => res.json({ "Cart:": cart }))
    .catch((error) =>
      res.send({
        status: "error",
        error: `Error al agregar el carrito ${error}`,
      })
    );
});

router.get("/api/carts/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  if (isNaN(cid))
    return res.send({
      status: "error",
      error: "El id tiene que ser un numero",
    });
  try {
    const cart = await cartManager.getCart(cid);
    const products = cart.products;
    const productsWithTitle = [];
    for (let i = 0; i < products.length; i++) {
      const product = await productManager.getProductById(products[i].id);
      const productO = {
        id: products[i].id,
        title: product.title,
        quantity: products[i].quantity,
      };
      productsWithTitle.push(productO);
    }
    res.json({ "Products in cart:": productsWithTitle });
  } catch (error) {
    console.error("Error al obtener el carrito.", error);
    res.send({
      status: "error",
      error: `Error al obtener el carrito. ${error}`,
    });
  }
});

router.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  if (isNaN(cid) || isNaN(pid))
    return res.send({
      status: "error",
      error: "Los ids tienen que ser un numero",
    });
  let product;
  try {
    product = await productManager.getProductById(pid);
  } catch (error) {
    console.error("Error al obtener el producto.", error);
    return res.send({
      status: "error",
      error: `Error al obtener el producto. ${error}`,
    });
  }

  try {
    const cart = await cartManager.addProductToCart(cid, pid);
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.send({
      status: "error",
      error: `Error al añadir el producto al carrito. ${error}`,
    });
  }
});

export default router;
