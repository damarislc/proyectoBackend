import express from "express";
import { createHash, passportCall } from "../utils.js";
import jwt from "jsonwebtoken";
import { privateKey, tokenCookieName } from "../config/config.js";
import userModel from "../dao/models/user.model.js";
import passport from "passport";

const router = express.Router();

//Ruta para guardar el usuario que se quiere registrar
router.post("/register", passportCall("register"), (req, res, next) => {
  res.status(200).send({
    success: true,
    message: "Usuario creado correctamente",
  });
});

//ruta para buscar al usario que quiere hacer login
router.post("/login", passportCall("login"), (req, res, next) => {
  //Si la autenticacion fue correcta, se crea el token del usuario
  //para ello creamos un objeto con la informacion que queremos almacenar del usuario
  const userToken = {
    name: req.user.name,
    lastname: req.user.lastname,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
    cart: req.user.cart,
  };
  //creamos el token
  const token = jwt.sign(userToken, privateKey, {
    expiresIn: "24h",
  });

  //guardamos el token en una cookie con httpOnly true y mandamos la respuesta
  res
    .cookie(tokenCookieName, token, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
    })
    .send({
      success: true,
    });
});

/* router.get("/current", passportCall("jwt"), (req, res, next) => {
  //manda un mensaje exitoso
  res.status(200).send({
    success: true,
    message: "estas autorizado!",
    payload: req.user,
    token: req.token,
  });
}); */

//ruta para destruir la sesion cuando se hace logout
/* router.get("/logout", (req, res, next) => {
  
}); */
router.get("/logout", (req, res) => {
  if (req.cookies[tokenCookieName]) {
    res.clearCookie(tokenCookieName).status(200).json({
      success: true,
      message: "You have logged out",
    });
  } else {
    res.status(401).json({
      error: "Invalid jwt",
    });
  }
});

//Ruta para restaurar la contraseña
router.post("/restore", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .send({ status: "error", error: "Todos los campos son obligatorios" });
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(401)
        .send({ status: "error", error: "Usuario incorrecto" });
    user.password = createHash(password);
    await userModel.updateOne({ email }, { password: user.password });
    //manda un mensaje exitoso
    res.status(200).send({
      status: "success",
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    res.status(500).send(`Error al restablecer contraseña. ${error}`);
  }
});

//TODO investigar como usar github con jwt
/* 
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  async (req, res) => {
    //Si la autenticacion fue correcta, se crea el token del usuario
    //para ello creamos un objeto con la informacion que queremos almacenar del usuario
    const userToken = {
      name: req.user.name,
      lastname: req.user.lastname,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };
    //creamos el token
    const token = jwt.sign(userToken, privateKey, {
      expiresIn: "24h",
    });

    //guardamos el token en una cookie con httpOnly true y mandamos la respuesta
    res
      .cookie(tokenCookieName, token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .send({
        success: true,
      });
  }
); */
export default router;
