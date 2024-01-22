import express from "express";
import path from "path";
import __dirname from "../utils.js";
import CartManager from "../models/cartManager.js";
import ProductManager from "../models/productManager.js";

//Inicializando el router
const router = express.Router();

//Path de la "base de datos" (json) de productos
const cartsdb = path.join(__dirname, "/db", "carts.json");
const productsdb = path.join(__dirname, "/db", "products.json");
const cartManager = new CartManager(cartsdb);
const productManager = new ProductManager(productsdb);

//****Endpoints****
/**
 * Post para crear el carrito vacío
 */
router.post("/api/carts", (req, res) => {
  //Obtiene la promesa del addCart
  const cartPromise = cartManager.addCart();
  /** Promesa,
   * si se cumple, devuelve el carrito creado, el cual contiene
   * el id del carrito y el arreglo de productos vacío.
   * Si no se cumple, manda un mensaje de error.
   */
  cartPromise
    .then((cart) => res.json({ "Cart:": cart }))
    .catch((error) =>
      res.send({
        status: "error",
        error: `Error al agregar el carrito ${error}`,
      })
    );
});

/**
 * Get para obtener los productos del carrito especificado.
 * Se hace una función anónima asíncrona para poder manipular las promesas.
 * Recibe como parámetro el id del carrito.
 * Modo de ejecución: http://localhost:8080/api/carts/:cid
 */
router.get("/api/carts/:cid", async (req, res) => {
  //Obtiene el id desde el parámetro del request
  const cid = parseInt(req.params.cid);
  //Si el id no es un número, manda un mensaje de error
  if (isNaN(cid))
    return res.send({
      status: "error",
      error: "El id tiene que ser un numero",
    });
  try {
    //Obtiene el carrito a partir de su id
    const cart = await cartManager.getCart(cid);
    //Obtiene el arreglo de productos.
    const products = cart.products;
    //Nuevo arreglo que contendra los productos con sus titulos
    const productsWithTitle = [];
    //for para recorrer el arreglo de productos.
    for (let i = 0; i < products.length; i++) {
      //Obtiene el producto en el índice correspondiente
      const product = await productManager.getProductById(products[i].id);
      //Crea un objeto con el ide del producto, titulo y cantidad
      const productO = {
        id: products[i].id,
        title: product.title,
        quantity: products[i].quantity,
      };
      //lo guarda en el arrglo
      productsWithTitle.push(productO);
    }
    /* Manda el JSON de respuesta de los productos en el carrito 
       con el titulo correspondiente. */
    res.json({ "Products in cart:": productsWithTitle });
  } catch (error) {
    //Manda un mensaje de error si hubo un error al obtener el carrito o los productos.
    console.error("Error al obtener el carrito.", error);
    res.send({
      status: "error",
      error: `Error al obtener el carrito. ${error}`,
    });
  }
});

/**
 * Post para añadir un producto a un carrito.
 * Se hace una función anónima asíncrona para poder manipular las promesas.
 * Recibe como parámetros el id del carrito y el id del producto.
 * Modo de ejecución: http://localhost:8080/api/carts/:cid/product/:pid
 */
router.post("/api/carts/:cid/product/:pid", async (req, res) => {
  //Obtiene el id del carrito
  const cid = parseInt(req.params.cid);
  //Obtiene el id del producto
  const pid = parseInt(req.params.pid);

  //Si el cid o el pid no son número, manda mensaje de error.
  if (isNaN(cid) || isNaN(pid))
    return res.send({
      status: "error",
      error: "Los ids tienen que ser un numero",
    });

  let product;

  try {
    //Revisa si existe el producto a añadir.
    product = await productManager.getProductById(pid);
  } catch (error) {
    //Si hubo un error al obtener el producto, manda mensaje con el error.
    console.error("Error al obtener el producto.", error);
    return res.send({
      status: "error",
      error: `Error al obtener el producto. ${error}`,
    });
  }

  try {
    //Añade el producto al carrito especificado
    const cart = await cartManager.addProductToCart(cid, pid);
    //Manda el JSON con el carrito actualizado.
    res.json({ Added: cart });
  } catch (error) {
    //Si hubo un error al añadir el producto, manda mensaje con el error.
    console.log(error);
    res.send({
      status: "error",
      error: `Error al añadir el producto al carrito. ${error}`,
    });
  }
});

export default router;
