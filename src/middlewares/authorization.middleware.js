import jwt from "jsonwebtoken";
import config from "../config/config.js";

/* export const authorization = (role) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ success: false, error: "No autorizado" });
    if (role === "all") return next();
    if (req.user.role !== role)
      return res
        .status(403)
        .json({ success: false, error: "Sin autorizacion" });
    next();
  };
}; */

export const handlePolicies = (policies) => (req, res, next) => {
  const user = jwt.decode(req.cookies[config.tokenCookieName]);

  if (policies[0] === "public") return next(); //cualquiera puede entrar

  if (!user)
    return res.status(401).send({ success: false, message: "Sin acceso" });

  if (!policies.includes(user.role.toLowerCase()))
    return res.status(403).send({ success: false, message: "Sin permiso" });

  return next();
};

/**
 * Crea un token temporal de role premium para probar la api en apidocs
 * @returns next para ejecutar la siguiente instruccion de la ruta
 */
export const apiTemporalToken = () => (req, res, next) => {
  const userToken = {
    name: "Test",
    lastname: "API",
    email: "test@api.com",
    role: "premium",
  };

  const token = jwt.sign(userToken, config.privateKey, { expiresIn: "1h" });

  req.logger.debug("Token creado");

  res.cookie(config.tokenCookieName, token, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
  });

  return next();
};
