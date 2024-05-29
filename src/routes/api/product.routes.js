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
  disableProduct,
} = new ProductController();

//Obtener todos los productos
router.get("/", getProducts);

//Obtener producto por id
router.get("/:pid", getProductById);

//Añadir producto
router.post("/", handlePolicies(["admin", "premium"]), createProduct);

//Actualizar producto
router.put("/:pid", handlePolicies(["admin", "premium"]), updateProduct);

//Eliminar producto
router.delete("/:pid", handlePolicies(["admin", "premium"]), deleteProduct);

//Deshablitar producto
router.put(
  "/disable/:pid",
  handlePolicies(["admin", "premium"]),
  disableProduct
);

export default router;
