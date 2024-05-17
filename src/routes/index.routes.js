import { Router } from "express";
import cartRoutes from "./api/cart.routes.js";
import productRoutes from "./api/product.routes.js";
import sessionRoutes from "./api/sessions.routes.js";
import viewsRoutes from "./api/views.routes.js";
import userRoutes from "./api/user.routes.js";
import loggerTest from "./api/loggerTest.routes.js";
import errorHandler from "../middlewares/errorHandler.middleware.js";
import { logger } from "../middlewares/logger.js";

const router = Router();
router.use(logger);

//asignacion de routes
router.use("/api/products", productRoutes);
router.use("/api/carts", cartRoutes);
router.use("/api/sessions", sessionRoutes);
router.use("/api/user", userRoutes);
router.use("/loggerTest", loggerTest);
router.use("/", viewsRoutes);
router.use("*", (req, res) => {
  res.status(404).send("Not found");
});

router.use(errorHandler);

export default router;
