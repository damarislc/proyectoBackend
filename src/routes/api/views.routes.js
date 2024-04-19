import express from "express";
import { passportCall } from "../../utils.js";
import ViewsController from "../../controllers/views.controller.js";
import { authorization } from "../../middlewares/authorization.middleware.js";

const {
  renderInicio,
  renderChat,
  renderLogin,
  renderRegister,
  renderRestore,
  renderCurrent,
  renderProducts,
  renderCart,
  renderProduct,
  renderCreate,
} = new ViewsController();

const router = express.Router();

//Por defecto mandar a products
router.get("/", renderInicio);

//Renderea la página del chat
router.get("/chat", passportCall("jwt"), authorization("user"), renderChat);

//Renderea la pagina de login
router.get("/login", renderLogin);

//Renderea la pagina de registro
router.get("/register", renderRegister);

router.get("/restore", renderRestore);

router.get("/current", passportCall("jwt"), renderCurrent);

//Obtiene los productos desde un fetch de la api de products
router.get("/products", passportCall("jwt"), renderProducts);

router.get(
  "/edit/:pid",
  passportCall("jwt"),
  authorization("admin"),
  renderProduct
);

router.get(
  "/create",
  passportCall("jwt"),
  authorization("admin"),
  renderCreate
);

//obtiene el carrito desde un fetch de la api de carts
router.get("/carts/:cid", passportCall("jwt"), renderCart);

export default router;
