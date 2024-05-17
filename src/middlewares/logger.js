import winston, { format, transports, createLogger } from "winston";
import { environment } from "../config/config.js";
const { combine, timestamp, colorize, printf } = format;

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "cyan",
    debug: "white",
  },
};

const options = {
  console: {
    format: combine(
      timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
      colorize({ colors: customLevelOptions.colors }),
      printf((info) => `${info.level} | ${info.timestamp} | ${info.message}`)
    ),
  },
  file: {
    format: combine(
      timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
      printf((info) => `${info.level} | ${info.timestamp} | ${info.message}`)
    ),
    filename: "./errors.logs",
  },
};

const logConfigDev = {
  levels: customLevelOptions.levels,
  level: "debug",

  transports: [new transports.Console(options.console)],
};

const logConfigProd = {
  levels: customLevelOptions.levels,
  level: "info",
  transports: [
    new transports.Console(options.console),
    new transports.File(options.file),
  ],
};

winston.addColors(customLevelOptions.colors);

//const logger = winston.createLogger();
export const logger = (req, res, next) => {
  const logger =
    environment === "PROD"
      ? createLogger(logConfigProd)
      : createLogger(logConfigDev);
  Object.keys(customLevelOptions.levels).forEach((level) => {
    logger[level] = function (message) {
      logger.log({ level: level, message: message });
    };
  });
  req.logger = logger;
  next();
};
