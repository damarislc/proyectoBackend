import { Router } from "express";
import cartRoutes from "./api/cart.routes.js";
import productRoutes from "./api/product.routes.js";
import sessionRoutes from "./api/sessions.routes.js";
import viewsRoutes from "./api/views.routes.js";
import userRoutes from "./api/user.routes.js";
import loggerTest from "./api/loggerTest.routes.js";
import errorHandler from "../middlewares/errorHandler.middleware.js";
import { logger } from "../middlewares/logger.js";
import swaggerUiExpress from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../utils.js";
import { apiTemporalToken } from "../middlewares/authorization.middleware.js";

const router = Router();
router.use(logger);

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Documentación de eCommerce Backend",
      description: "API Docs para eCommerce",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

//asignacion de routes
router.use("/api/products", productRoutes);
router.use("/api/carts", cartRoutes);
router.use("/api/sessions", sessionRoutes);
router.use("/api/user", userRoutes);
router.use("/loggerTest", loggerTest);
router.use("/", viewsRoutes);
//ruta de apidocs el cual crea un token temporal para poder usar los request con acceso premium
router.use(
  "/apidocs",
  swaggerUiExpress.serve,
  apiTemporalToken(),
  swaggerUiExpress.setup(specs)
);
router.use("*", (req, res) => {
  res.status(404).send("Not found");
});

router.use(errorHandler);

export default router;
