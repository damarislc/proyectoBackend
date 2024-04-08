import express from "express";
import { passportCall } from "../../utils.js";
import SessionsController from "../../controllers/sessions.controller.js";

const router = express.Router();
const { register, login, logout, restore } = new SessionsController();

//Ruta para guardar el usuario que se quiere registrar
router.post("/register", passportCall("register"), register);

//ruta para buscar al usario que quiere hacer login
router.post("/login", passportCall("login"), login);

//Ruta para limpiar la cookie al hacer logout
router.get("/logout", logout);

//Ruta para restaurar la contraseña
router.post("/restore", restore);

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
