import ProductRepository from "../repositories/product.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import UserRepository from "../repositories/user.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";
import ProductDao from "../dao/productDao.js";
import CartDao from "../dao/cartDao.js";
import UserDao from "../dao/userDao.js";
import TicketDao from "../dao/ticketDao.js";

export const productService = new ProductRepository(new ProductDao());
export const cartService = new CartRepository(new CartDao(), new ProductDao());
export const userService = new UserRepository(new UserDao());
export const ticketService = new TicketRepository(
  new TicketDao(),
  new ProductDao(),
  new CartDao()
);
