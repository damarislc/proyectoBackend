import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
//import { privateKey, tokenCookieName } from "./config/config.js";
import passport from "passport";
import { fakerES as faker } from "@faker-js/faker";
import CustomError from "./services/errors/CustomError.js";
import { generateUserErrorInfo } from "./services/errors/info.js";
import EErrors, { EPassport } from "./services/errors/enums.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default __dirname;

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);
export const createResponse = (res, statusCode, data) => {
  return res.status(statusCode).json({ data });
};

export const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        let err;
        switch (info.error) {
          case EPassport.MISSING_FIELDS:
            err = new CustomError(
              "Error al registrarse",
              generateUserErrorInfo(info.user),
              "Campos faltantes o incorrectos",
              EErrors.INVALID_TYPES_ERROR
            );
            return next(err);
          case EPassport.USER_EXISTS:
            err = new CustomError(
              "Error al registarse",
              "El usuario ingresado ya existe",
              "Usuario existente",
              EErrors.INVALID_TYPES_ERROR
            );
            return next(err);
          case EPassport.USER_NO_EXISTS:
            err = new CustomError(
              "Error en el login",
              info.message,
              "El usuario ingresado no existe",
              EErrors.INVALID_TYPES_ERROR
            );
            return next(err);
          case EPassport.PASSWORD_INCORRECT:
            err = new CustomError(
              "Error en el login",
              info.message,
              "La contraseña no es correcta",
              EErrors.INVALID_TYPES_ERROR
            );
            return next(err);
          default:
            return next(info.message);
        }
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const products = [];
export const generateProducts = () => {
  for (let i = 0; i < 100; i++) {
    let product = {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.commerce.isbn(),
      price: faker.commerce.price(),
      status: true,
      stock: faker.number.int(50),
      id: faker.database.mongodbObjectId(),
      category: faker.commerce.department(),
    };
    products.push(product);
  }
};
