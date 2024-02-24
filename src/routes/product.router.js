import express from "express";
import ProductManager from "../dao/productManager.js";

const router = express.Router();
//crea una instancia del ProductManager
const productManager = new ProductManager();

//Obtener todos los productos
router.get("/", (req, res) => {
  //Llama el método getProducts
  //si la promesa es exitosa manda el resultado
  //sino manda un mensaje de error
  productManager
    .getProducts()
    .then((products) => res.send({ result: "sucess", payload: products }))
    .catch((error) =>
      res.send({
        status: "error",
        error: "Error al obtener los productos, " + error,
      })
    );
});

//Obtener producto por id
router.get("/:pid", (req, res) => {
  //Obtiene el id del producto desde el params
  const pid = req.params.pid;
  //Llama el método getProductById para obtener el producto según su id
  //si la promesa es exitosa manda el resultado
  //sino manda un mensaje de error
  productManager
    .getProductById(pid)
    .then((product) => {
      if (result) {
        res.send({ result: "sucess", payload: product });
      }
      res.send({
        result: "error",
        error: `El producto con el id ${pid} no existe.`,
      });
    })
    .catch((error) =>
      res.send({
        status: "error",
        error: "Error al obtener el producto, " + error,
      })
    );
});

//Añadir producto
router.post("/", (req, res) => {
  //Obtiene el json del product desde el body
  const product = req.body;
  //Llama el método addProduct para añadir el producto a la colección
  //si la promesa es exitosa manda el resultado
  //sino manda un mensaje de error
  productManager
    .addProduct(product)
    .then((result) => res.send({ result: "sucess", payload: result }))
    .catch((error) =>
      res.send({
        status: "error",
        error: "Error al añadir el producto, " + error,
      })
    );
});

//Actualizar producto
router.put("/:pid", (req, res) => {
  //Obtiene el id de prodcuto a actualizar y el json de los campos actualizados
  const pid = req.params.pid;
  const product = req.body;
  //Llama el método updateProduct con el id del producto y los nuevos campos
  //si la promesa es exitosa manda el resultado
  //sino manda un mensaje de error
  productManager
    .updateProduct(pid, product)
    .then((result) => {
      if (result) {
        res.send({ result: "sucess", payload: result });
      }
      res.send({
        result: "error",
        error: `El producto con el id ${pid} no existe.`,
      });
    })
    .catch((error) =>
      res.send({
        status: "error",
        error: "Error al actualizar el producto, " + error,
      })
    );
});

//Eliminar producto
router.delete("/:pid", async (req, res) => {
  //Obtiene el id del producto desde el params
  const pid = req.params.pid;
  //Llama el método deleteProduct con el id del producto a eliminar
  //si la promesa es exitosa manda el resultado
  //sino manda un mensaje de error
  productManager
    .deleteProduct(pid)
    .then((result) => res.send({ result: "sucess", payload: result }))
    .catch((error) =>
      res.send({
        status: "error",
        error: "Error al eliminar el producto, " + error,
      })
    );
});

export default router;
