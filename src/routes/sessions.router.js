import express from "express";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword, issueJWT } from "../utils.js";
import CartManager from "../dao/cartManager.js";
import passport from "passport";

const router = express.Router();

//Ruta para guardar el usuario que se quiere registrar
router.post("/register", async (req, res, next) => {
  const { name, lastname, age, email, password } = req.body;
  if (!name || !lastname || !age || !email || !password) {
    return res
      .status(401)
      .send({ status: "error", message: "Todos los campos son obligatorios" });
  }
  try {
    let user = await userModel.findOne({ email: email });
    if (user) {
      return res
        .status(401)
        .send({ status: "error", message: "El usuario ya existe" });
    }
    const cartManager = new CartManager();
    const cart = await cartManager.addCart();
    const newUser = {
      name,
      lastname,
      age,
      email,
      cart: cart._id,
      password: createHash(password),
    };
    //crea un nuevo usuario dentro de la base de datos
    let userCreated = await userModel.create(newUser);
    //crea el jwt token
    const jwt = issueJWT(userCreated);
    //manda mensaje de que le usuario ha sido creado
    res.status(200).send({
      success: true,
      message: "Usuario creado correctamente",
      user: userCreated,
      token: jwt.token,
      expiresIn: jwt.expires,
    });
  } catch (error) {
    next(error);
  }
});

//ruta para buscar al usario que quiere hacer login
router.post("/login", async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "El usuario no existe" });
    }

    const isValid = isValidPassword(user, req.body.password);
    if (!isValid) {
      return res
        .status(401)
        .send({ success: false, message: "La contraseña es incorrecta" });
    }

    const jwt = issueJWT(user);
    delete user.password;
    console.log("user=", user);
    return res.status(200).send({
      success: true,
      token: jwt.token,
      expires: jwt.expires,
      user: user,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    //manda un mensaje exitoso
    res.status(200).send({
      success: true,
      message: "estas autorizado!",
    });
  }
);

//ruta para destruir la sesion cuando se hace logout
router.get("/logout", (req, res, next) => {});

export default router;
