import jwt from "passport-jwt";
import userModel from "../dao/models/user.model.js";
import { privateKey } from "./config.js";

const ExtractJwt = jwt.ExtractJwt;
const JwtStrategy = jwt.Strategy;

const initializePassport = (passport) => {
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["cookieToken"];
    }

    return token;
  };

  const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: privateKey,
  };

  passport.use(
    "jwt",
    new JwtStrategy(options, (jwt_payload, done) => {
      console.log("jwt_payload=", jwt_payload);

      userModel
        .findOne({ email: jwt_payload.email })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false, { message: "El usuario no existe" });
          }
        })
        .catch((err) =>
          done(err, null, { message: "Error en la autenticación:" + err })
        );
    })
  );

  passport.serializeUser(async (user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      req.session.messages = [];
      done("Error deserializando el usuario: " + error);
    }
  });
};

export default initializePassport;
