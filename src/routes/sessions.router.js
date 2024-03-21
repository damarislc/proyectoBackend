import express from "express";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword, passportCall } from "../utils.js";
import CartManager from "../dao/cartManager.js";
//import passport from "passport";
import jwt from "jsonwebtoken";
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
    console.log("user=", user);
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
    console.log("userCreated=", userCreated);
    //crea el jwt token
    //const jwt = issueJWT(userCreated);
    //manda mensaje de que le usuario ha sido creado
    res.status(200).send({
      success: true,
      message: "Usuario creado correctamente",
      user: userCreated,
      //token: jwt.token,
      //expiresIn: jwt.expires,
    });
  } catch (error) {
    next(error);
  }
});

//ruta para buscar al usario que quiere hacer login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "El usuario no existe" });
    }

    const isValid = isValidPassword(user, password);
    if (!isValid) {
      return res
        .status(401)
        .send({ success: false, message: "La contraseña es incorrecta" });
    }

    //const jwt = issueJWT(user);
    const token = jwt.sign({ email, password }, "MySecretKey", {
      expiresIn: "24h",
    });

    /* console.log("token=", jwt.token); */
    /* console.log("user=", user); */
    res
      .cookie("cookieToken", token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .send({
        success: true,
        //token: jwt.token,
        token,
        //expires: jwt.expires,
        user,
      });
    /* return res.status(200).send({
      success: true,
      token: jwt.token,
      expires: jwt.expires,
      user: user,
    }); */
  } catch (error) {
    next(error);
  }
});

router.get("/current", passportCall("jwt"), (req, res, next) => {
  //manda un mensaje exitoso
  res.status(200).send({
    success: true,
    message: "estas autorizado!",
  });
});

//ruta para destruir la sesion cuando se hace logout
router.get("/logout", (req, res, next) => {});
/* router.get('/logout', (req, res) => {
    if (req.cookies['jwt']) {
        res
        .clearCookie('jwt')
        .status(200)
        .json({
            message: 'You have logged out'
        })
    } else {
        res.status(401).json({
            error: 'Invalid jwt'
        })
    }
}) */

export default router;
