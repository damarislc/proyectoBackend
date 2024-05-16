import { createTransport } from "nodemailer";
import config from "../config/config.js";

const transport = createTransport({
  service: config.mailing.SERVICE,
  port: 587, //578?
  host: config.mailing.HOST,
  auth: {
    user: config.mailing.USER,
    pass: config.mailing.PASSWORD,
  },
});

export const sendMail = async ({ to, subject, html, attachments = [] }) => {
  return await transport.sendMail({
    from: "Ecommerce service <ecommerce@midominio.com>",
    to,
    subject,
    html,
    attachments,
  });
};
