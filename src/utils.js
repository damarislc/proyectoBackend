import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
//import { privateKey, tokenCookieName } from "./config/config.js";
import passport from "passport";

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
      try {
        if (!user) {
          return res
            .status(401)
            .send({ success: false, message: info.message });
        }
        req.user = user;
        next();
      } catch (error) {
        if (err) {
          console.log("err=", err);
          return next(err);
        }
      }
    })(req, res, next);
  };
};
