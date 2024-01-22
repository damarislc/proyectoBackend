import express from "express";
import path from "path";
import __dirname from "../utils.js";
import ProductManager from "../models/productManager.js";

//Inicializando el router
const router = express.Router();

//Path de la "base de datos" (json) de productos
const productsdb = path.join(__dirname, "/db", "products.json");
const productManager = new ProductManager(productsdb);

//****Endpoints*****
/**
 * Get que devuelve la lista de todos los productos del archivo si no se
 * incluye un limte. Modo de ejecucion: http://localhost:8080/products
 * Si incluye un limite por medio de query, devuelve solo los productos
 * requeridos. Modo de ejecucion: http://localhost:8080/products?limit=1
 */
router.get("/api/products", (req, res) => {
  //Obtiene el limite desde el query request
  const limit = parseInt(req.query.limit);
  //Obtiene la promesa con los productos
  const productsPromise = productManager.getProducts();

  /** Promesa,
   * si se cumple entonces devuelve todos los los productos o los productos limitados
   * si no se cumple, manda un mensaje de error con el error obtenido
   */
  productsPromise
    .then((products) => {
      /**
       * Si limit no es un numero o
       * es igual o menor a 0 o
       * el limite otorgado es mayor al arreglo de productos,
       * devuelve todos los productos.
       */
      if (isNaN(limit) || limit <= 0 || limit > products.length)
        return res.json(products);

      /**
       * Si no entro al if anterior quiere decir que contiene un
       * limite correcto, por lo que crea un nuevo arreglo desde
       * la posicion 0 hasta el limite de productos solicitados
       * y los regresa en formato de json.
       */
      let productsLimited = products.slice(0, limit);
      res.json(productsLimited);
    })
    .catch((error) =>
      res.send({
        status: "error",
        error: `Error al obtener los productos, ${error}`,
      })
    );
});

/**
 * Get que devuelve el producto con el id solicitado.
 * Recibe como parámetro el id del producto
 * Modo de ejecucion: http://localhost:8080/products/:pid
 */
router.get("/api/products/:pid", (req, res) => {
  //Obtiene el id desde el parametro del request
  const pid = parseInt(req.params.pid);
  //Si el id no es un numero, manda un msj de error
  if (isNaN(pid))
    return res.json({ message: "Error, el id debe ser un numero" });
  //Obtiene la promesa del producto segun el id del parametro
  const productPromise = productManager.getProductById(pid);
  /** Promesa,
   * si la promesa se cumple entonces devuelve el producto
   * si no, manda un mensaje de error.
   */
  productPromise
    .then((product) => {
      res.json(product);
    })
    .catch((error) =>
      res.send({
        status: "error",
        error: `Error al obtener el producto. ${error}`,
      })
    );
});

/**
 * Post para añadir un nuevo producto.
 * Modo de ejecución: http://localhost:8080/api/products
 * Body raw JSON ejemplo: 
   {
    "title": "Rodillo para pintar",
    "description": "Rodillo de pared, 30 cm",
    "code": "AASD1456",
    "price": 75,
    "status": true,
    "stock": 10,
    "category": "Herramientas para pintar",
    "thumbnail": ["url1", "url2"]
   }
   Todos los campos son requeridos excepto thumnail y status,
   status si no es incluido por default se le asignará true.
 */
router.post("/api/products", (req, res) => {
  //Obtiene el body con el JSON del objeto que se agregará
  const product = req.body;
  /** Manda a llamar la promesa para añadir un producto
   * si se cumple, regresa el producto con un mensaje de éxito,
   * si no, manda un mensaje de error.
   */
  productManager
    .addProduct(product)
    .then((p) => res.json({ Success: p }))
    .catch((err) => res.send({ status: "error", error: err }));
});

/**
 * Put para actualizar un producto.
 * Modo de ejecución: http://localhost:8080/api/products/:pid
 * no se requiere mandar todos los campos, solo los que se van a actualizar.
 * Si se manda el codigo y no es el mismo y se está repitiendo el código de otro producto,
 * mandará mensaje de error y no se actualizará.
 */
router.put("/api/products/:pid", (req, res) => {
  //Obtiene el body con el JSON de los campos que se actualizarán
  const product = req.body;
  //Obtiene el id del producto que de actualizará
  const pid = parseInt(req.params.pid);
  //Si el id no es un número, manda msj de error.
  if (isNaN(pid))
    return res.send({
      status: "error",
      error: "El id tiene que ser un numero",
    });
  /** Manda a llamar la promesa para actualizar el producto,
   * recibe el id y los nuevos campos en un objeto.
   * Si se cumple manda un mensaje con el producto actualizado,
   * si no se cumple manda un mensaje de error.
   * */
  productManager
    .updateProduct(pid, product)
    .then((p) => res.json({ Updated: p }))
    .catch((err) => res.send({ status: "error", error: err }));
});

/**
 * Delete para borrar un producto.
 * Modo de ejecución: http://localhost:8080/api/products/:pid
 */
router.delete("/api/products/:pid", (req, res) => {
  //Obtiene el id el producto que se desea eliminar
  const pid = parseInt(req.params.pid);
  //Si el id no es un número, manda msj de error.
  if (isNaN(pid))
    return res.send({
      status: "error",
      error: "El id tiene que ser un numero",
    });
  /** Manda a llamar la promesa para borrar el producto,
   * recibe el id del producto.
   * Si se cumple manda un mensaje con el producto eliminado,
   * si no se cumple manda un mensaje de error.
   * */
  productManager
    .deleteProduct(pid)
    .then((p) => res.json({ Deleted: p }))
    .catch((err) => res.send({ status: "error", error: err }));
});

export default router;
