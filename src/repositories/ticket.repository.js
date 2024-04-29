import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

export default class TicketRepository {
  constructor(dao, productDao, cartDao) {
    this.dao = dao;
    this.cartDao = cartDao;
    this.productDao = productDao;
  }

  getTickets = async () => {
    return await this.dao.gets();
  };

  getTicket = async (tid) => {
    return await this.dao.getById(tid);
  };

  getTicketByCode = async (code) => {
    return await this.dao.getByCode(code);
  };

  createTicket = async (userEmail, cid) => {
    const cart = await this.cartDao.get(cid);

    if (!cart) {
      const err = new CustomError(
        "Error al finalizar la compra",
        `El el carrito con el id "${cid}" no existe.`,
        "No se pudo realizar la compra ya que no se encontró el carrito",
        EErrors.INVALID_TYPES_ERROR
      );
      throw err;
    }

    //Lista de productos que sí se pudieron comprar
    const productsPurchased = [];
    const productsOutOfStock = [];
    let amountacc = 0;

    for (const item of cart.products) {
      const product = item.productId;
      const quantity = item.quantity;
      const resultStock = await this.productDao.getStock(product._id);
      const stock = resultStock.stock;
      const status = product.status;

      if (quantity <= stock && status) {
        productsPurchased.push({ id: product._id, title: product.title });
        await this.productDao.updateStock(product._id, stock - quantity);
        amountacc += quantity * product.price;
      } else {
        productsOutOfStock.push({ id: product._id, title: product.title });
      }
    }

    let result;

    if (productsPurchased.length > 0) {
      const ticket = await this.dao.create({
        code: Math.random() * 1000,
        //purchase_datetime: new Date().,
        amount: amountacc,
        purchaser: userEmail,
      });

      productsPurchased.forEach((product) => {
        const productDeleted = this.cartDao.deleteItem(cid, product.id);
      });

      result = {
        ticket,
        productsPurchased: productsPurchased,
        productsOutOfStock: productsOutOfStock,
      };
    } else {
      result = {
        productsPurchased: [],
        productsOutOfStock: productsOutOfStock,
      };
    }

    return result;
  };
}
