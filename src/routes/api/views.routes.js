import express from "express";
import { passportCall } from "../../utils.js";
import ViewsController from "../../controllers/views.controller.js";
import { handlePolicies } from "../../middlewares/authorization.middleware.js";

const {
  renderInicio,
  renderChat,
  renderLogin,
  renderRegister,
  renderRestore,
  renderCurrent,
  renderUpdate,
  renderProducts,
  renderCart,
  renderProduct,
  renderCreate,
  renderProductsMockup,
  renderTokenExpired,
  renderUpload,
  renderUsersAdmin,
} = new ViewsController();

const router = express.Router();

//Por defecto mandar a products
router.get("/", renderInicio);

//Renderea la página del chat
router.get(
  "/chat",
  passportCall("jwt"),
  handlePolicies(["user", "premium"]),
  renderChat
);

//Renderea la pagina de login
router.get("/login", renderLogin);

//Renderea la pagina de registro
router.get("/register", renderRegister);

router.get("/restore", renderRestore);

router.get("/tokenExpired", renderTokenExpired);

router.get("/current", passportCall("jwt"), renderCurrent);

router.get("/update/:uid", passportCall("jwt"), renderUpdate);

router.get("/uploadDocuments/:uid", passportCall("jwt"), renderUpload);

//Obtiene los productos desde un fetch de la api de products
router.get("/products", passportCall("jwt"), renderProducts);

//Mocking route
router.get("/mockingproducts", passportCall("jwt"), renderProductsMockup);

router.get(
  "/edit/:pid",
  passportCall("jwt"),
  handlePolicies(["admin", "premium"]),
  renderProduct
);

router.get(
  "/create",
  passportCall("jwt"),
  handlePolicies(["admin", "premium"]),
  renderCreate
);

//obtiene el carrito desde un fetch de la api de carts
router.get("/carts/:cid", passportCall("jwt"), renderCart);

router.get(
  "/usersAdmin",
  passportCall("jwt"),
  handlePolicies(["admin"]),
  renderUsersAdmin
);

export default router;
