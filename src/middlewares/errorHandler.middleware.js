import EErrors from "../services/errors/enums.js";

export default (error, req, res, next) => {
  switch (error.code) {
    case EErrors.NOT_FOUND:
      res.status(404).send({
        success: false,
        error,
      });
      break;
    case EErrors.INVALID_TYPES_ERROR:
      res.status(400).send({
        success: false,
        error,
      });
      break;
    case EErrors.OUT_OF_STOCK:
      res.send({ success: false, unavailable: true, error });
      break;
    case EErrors.DATABASE_ERROR:
      res.status(500).send({ success: false, error });
      break;
    default:
      res
        .status(500)
        .send({ success: false, error: "Error no contemplado." + error });
      break;
  }
};
