export default class CustomError extends Error {
  constructor(name, cause, message, code) {
    super(message);
    this.code = code;
    this.name = name;
    this.cause = cause;

    Error.captureStackTrace(this, this.constructor);
  }
}
