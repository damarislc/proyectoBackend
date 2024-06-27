import dotenv from "dotenv";

export const environment = "DEV";
//dotenv.config({ path: environment === "DEV" ? "./.env.dev" : "./.env.prod" });
dotenv.config({ path: "./.env" });

export default {
  mongoURL: process.env.MONGOURL,
  adminName: process.env.ADMINNAME,
  adminPassword: process.env.ADMINPASSWORD,
  privateKey: process.env.PRIVATEKEY,
  tokenCookieName: process.env.TOKENCOOKIENAME,
  mailing: {
    SERVICE: process.env.MAILING_SERVICE,
    HOST: process.env.MAILING_HOST,
    USER: process.env.MAILING_USER,
    PASSWORD: process.env.MAILING_PASSWORD,
  },
};
