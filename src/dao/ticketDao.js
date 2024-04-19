import ticketModel from "./models/ticket.model.js";

export default class TicketDao {
  constructor() {
    this.ticketModel = ticketModel;
  }

  /**
   * Método para buscar y devolver todos los tickets
   * @returns los tickets
   */
  async gets() {
    return await this.ticketModel.find();
  }

  /**
   * Método para buscar un ticket por ID
   * @param {*} tid el ID del ticket
   * @returns el ticket encontrado
   */
  async getById(tid) {
    return await this.ticketModel.findById(tid);
  }

  /**
   * Crea un ticket nuevo
   * @param {*} newTicket el objeto del ticket
   * @returns el ticket creado
   */
  async create(newTicket) {
    return await this.ticketModel.create(newTicket);
  }

  /**
   * Busca un ticket por su código
   * @param {*} code el código del ticket
   * @returns el ticket encontrado
   */
  async getByCode(code) {
    return await this.ticketModel.findOne({ code: code });
  }
}
