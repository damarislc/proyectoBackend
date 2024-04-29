import { ticketService } from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

export default class TicketController {
  constructor() {
    this.ticketService = ticketService;
  }

  getTickets = (req, res) => {
    this.ticketService
      .getTickets()
      .then((tickets) => {
        return res.status(200).send({ success: true, payload: tickets });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          error: "Error al obtener los tickets, " + error,
        });
      });
  };

  getTicketById = (req, res) => {
    const tid = req.params.tid;

    this.ticketService
      .getTicketById(tid)
      .then((ticket) => {
        if (ticket) {
          res.status(201).sned({ success: true, payload: ticket });
        } else {
          res.status(404).send({
            success: false,
            message: `El ticket con el id ${tid} no existe.`,
          });
        }
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message: "Error al obtener el ticket, " + error,
        });
      });
  };

  getTicketByCode = (req, res) => {
    const code = req.query.code;

    this.ticketService
      .getTicketByCode(code)
      .then((ticket) => {
        if (ticket) {
          res.status(201).sned({ success: true, payload: ticket });
        } else {
          res.status(404).send({
            success: false,
            message: `El ticket con el código ${code} no existe.`,
          });
        }
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message: "Error al obtener el ticket, " + error,
        });
      });
  };

  createTicket = (req, res, next) => {
    const user = jwt.decode(req.cookies[config.tokenCookieName]);
    const cid = req.params.cid;
    this.ticketService
      .createTicket(user.email, cid)
      .then((result) => {
        if (result.productsPurchased.length > 0) {
          res.status(201).send({ success: true, payload: result });
        } else {
          /* res.status(200).send({
            success: false,
            message:
              "Ninguno de los productos se encuentran disponibles en este momento, no se pudo realizar la compra.",
          }); */
          const err = new CustomError(
            "Error al finalizar la compra",
            "Ninguno de los productos se encuentran disponibles en este momento, no se pudo realizar la compra.",
            "Error al finalizar la compra por falta de disponibilidad",
            EErrors.OUT_OF_STOCK
          );
          return next(err);
        }
      })
      .catch((error) => next(error));
  };
}
