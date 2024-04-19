export default class TicketRepository {
  constructor(dao, productDao, cartDao) {
    this.dao = dao;
    this.cartDao = cartDao;
    this.productDao = productDao;
  }

  getTickets = async () => {
    try {
      return await this.dao.gets();
    } catch (error) {
      return Promise.reject(`Error al obtener los tickets: ` + error);
    }
  };

  getTicket = async (tid) => {
    try {
      return await this.dao.getById(tid);
    } catch (error) {
      return Promise.reject(`Error al obtener el ticket: ` + error);
    }
  };

  getTicketByCode = async (code) => {
    try {
      return await this.dao.getByCode(code);
    } catch (error) {
      return Promise.reject(`Error al obtener el ticket: ` + error);
    }
  };

  createTicket = async (userEmail, cid) => {
    try {
      const cart = await this.cartDao.get(cid);

      if (!cart) {
        return res
          .status(401)
          .send({ success: false, message: "El carrito no existe" });
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
        const status = item.status;

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
    } catch (error) {
      return Promise.reject("Error al creat el ticket: " + error);
    }
  };
}
