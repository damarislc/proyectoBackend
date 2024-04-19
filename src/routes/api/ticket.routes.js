import express from "express";
import TicketController from "../../controllers/ticket.controller.js";

const router = express.Router();

const { getTickets, getTicketById, getTicketByCode, createTicket } =
  new TicketController();

export default router;
