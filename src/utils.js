import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { privateKey } from "./config/config.js";
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

/* export const issueJWT = (user) => {
  const _id = user._id;
  const expiresIn = "1d";
  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, privateKey, {
    expiresIn: expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}; */

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({ error: info });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};
