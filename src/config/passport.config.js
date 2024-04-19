import jwt from "passport-jwt";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/user.model.js";
import config from "./config.js";
import { createHash, isValidPassword } from "../utils.js";
import { cartService, userService } from "../services/index.js";
import UserDTO from "../dto/user.dto.js";

const ExtractJwt = jwt.ExtractJwt;
const JwtStrategy = jwt.Strategy;
const LocalStrategy = local.Strategy;

const initializePassport = (passport) => {
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[config.tokenCookieName];
    }

    return token;
  };

  const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: config.privateKey,
  };

  passport.use(
    "jwt",
    new JwtStrategy(options, (jwt_payload, done) => {
      try {
        const userDto = new UserDTO(jwt_payload);
        return done(null, userDto, { message: "Authenticado" });
      } catch (error) {
        return done(null, null, {
          message: "Error en la autenticación:" + error,
        });
      }
    })
  );

  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { name, lastname, email, age } = req.body;
        //si faltan campos, se manda un mensaje de error
        if (!name || !lastname || !email || !age || !password) {
          return done(null, false, {
            message: "Todos los campos son obligatorios",
          });
        }

        try {
          let user = await userService.getUserByEmail(username);
          if (user) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          const cart = await cartService.createCart();
          user = {
            name,
            lastname,
            age,
            email,
            cart: cart._id,
            password: createHash(password),
          };
          if (
            username === config.adminName &&
            password === config.adminPassword
          ) {
            user.role = "admin";
          }
          const userCreated = await userService.createUser(user);
          return done(null, userCreated);
        } catch (error) {
          return done(null, false, {
            message: "Error en el registro de usuario: " + error,
          });
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userService.getUserByEmail(username);
          if (!user) {
            return done(null, false, { message: "El usuario no existe" });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }
          return done(null, user);
        } catch (error) {
          return done(null, false, { message: "Error en el login: " + error });
        }
      }
    )
  );

  //TODO investigar como usar github con jwt
  /* passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.83595609caccb0b1",
        clientSecret: "344948e31151eb6f48df4b6df0455c7570fd9a9f",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            const newUser = {
              name: profile._json.name,
              lastname: "",
              email: profile._json.email,
              age: "",
              password: "",
            };
            const createdUser = await userModel.create(newUser);
            done(null, createdUser);
          } else done(null, user);
        } catch (error) {
          return done(null, false, {
            message: "Error en el login con GitHub: " + error,
          });
        }
      }
    )
  ); */

  passport.serializeUser(async (user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done("Error deserializando el usuario: " + error);
    }
  });
};

export default initializePassport;
