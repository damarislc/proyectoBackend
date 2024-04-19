import express, { query } from "express";
import ProductController from "../../controllers/product.controller.js";
import { handlePolicies } from "../../middlewares/authorization.middleware.js";

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
router.post("/", handlePolicies("ADMIN"), createProduct);

//Actualizar producto
router.put("/:pid", handlePolicies("ADMIN"), updateProduct);

//Eliminar producto
router.delete("/:pid", handlePolicies("ADMIN"), deleteProduct);

export default router;
