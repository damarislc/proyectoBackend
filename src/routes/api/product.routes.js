import express, { query } from "express";
import ProductController from "../../controllers/product.controller.js";

const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = new ProductController();

//Obtener todos los productos
router.get("/", getProducts);

//Obtener producto por id
router.get("/:pid", getProductById);

//Añadir producto
router.post("/", createProduct);

//Actualizar producto
router.put("/:pid", updateProduct);

//Eliminar producto
router.delete("/:pid", deleteProduct);

export default router;
