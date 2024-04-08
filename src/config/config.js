import dotenv from "dotenv";

/* const environment = "DEV";
dotenv.config({ path: environment === "DEV" ? "./.env.dev" : "./.env.prod" }); */
dotenv.config({ path: "./.env" });

export default {
  mongoURL: process.env.MONGOURL,
  adminName: process.env.ADMINNAME,
  adminPassword: process.env.ADMINPASSWORD,
  privateKey: process.env.PRIVATEKEY,
  tokenCookieName: process.env.TOKENCOOKIENAME,
};
