import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const authorization = (role) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ success: false, error: "No autorizado" });
    if (role === "all") return next();
    if (req.user.role !== role)
      return res.status(403).json({ success: false, error: "Sin permiso" });
    next();
  };
};

export const handlePolicies = (policies) => (req, res, next) => {
  const user = jwt.decode(req.cookies[config.tokenCookieName]);

  if (policies[0] === "PUBLIC") return next(); //cualquiera puede entrar

  if (!user)
    return res.status(401).send({ success: false, message: "No autorizado" });

  if (!policies.includes(user.role.toUpperCase()))
    return res.status(403).send({ success: false, message: "Sin permiso" });

  return next();
};
