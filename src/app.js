import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import __dirname, { generateProducts, products } from "./utils.js";
import path from "path";
import mongoose from "mongoose";
import config from "./config/config.js";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import cors from "cors";
import appRouter from "./routes/index.routes.js";
import { initChatSocket } from "./utils/socket.js";
/* import MongoStore from "connect-mongo";
import session from "express-session"; */

const app = express();
const PORT = 8080;

//middlewares para el manejo del REST
app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(cors());

//Seteando session con mongo
/* app.use(
  session({
    store: MongoStore.create({ mongoUrl: mongoURL, ttl: 1000 }),
    secret: "m!Secr3t",
    resave: false,
    saveUninitialized: true,
  })
); */

//Crea la conección con la base de datos
mongoose
  .connect(config.mongoURL)
  .then(() => console.log("Conectado a la BD"))
  .catch((error) => console.error("Error al conectarse a la BD", error));

initializePassport(passport);
app.use(passport.initialize());

/* app.use(passport.session()) */

//Configuracion de handlebars
//se le dice al engine que la extendion de handbelars sera hbs
app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
//se le dice al engine que busque los archivos con la extension hbs
app.set("view engine", ".hbs");
//se le dice donde se encuentra el folder de las vistas
app.set("views", path.resolve(__dirname + "/views"));
//se le dice donde estan los archivos estaticos
app.use(express.static(__dirname + "/public"));

app.use(appRouter);

//creando el http server
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  //ejecta el mockup de productos
  if (products.length === 0) generateProducts();
});

//creando el servidor de sockets
const io = new Server(httpServer);

initChatSocket(io);
