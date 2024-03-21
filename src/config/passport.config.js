import jwt from "passport-jwt";
import userModel from "../dao/models/user.model.js";
import { privateKey } from "./config.js";

const ExtractJwt = jwt.ExtractJwt;
const JwtStrategy = jwt.Strategy;
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: privateKey,
};

/* const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["cookieToken"];
  }

  return token;
}; */

const initializePassport = (passport) => {
  passport.use(
    "jwt",
    new JwtStrategy(options, (jwt_payload, done) => {
      console.log(jwt_payload);

      userModel
        .findOne({ _id: jwt_payload.sub })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => done(err, null));
    })
  );
};

export default initializePassport;
