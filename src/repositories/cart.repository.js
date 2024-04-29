import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

export default class CartRepository {
  constructor(cartDao, productDao) {
    this.cartDao = cartDao;
    this.productDao = productDao;
  }

  createCart = async () => {
    return await this.cartDao.create();
  };

  getCart = async (id) => {
    return await this.cartDao.get(id);
  };

  addProductToCart = async (cid, pid) => {
    const cart = await this.cartDao.get(cid);
    const productExists = await this.productDao.getById(pid);
    //Si el carrito no existe manda un mensaje de error
    if (!cart) {
      const err = new CustomError(
        "Error al añadir el producto al carrito",
        `El carrito con el id ${cid} no existe`,
        "Se intentó añadir un producto a un carrito inexistente",
        EErrors.INVALID_TYPES_ERROR
      );
      throw err;
      //y si el producto no existe, manda mensaje de error
    } else if (!productExists) {
      const err = new CustomError(
        "Error al añadir el producto al carrito",
        `El producto con el id ${pid} no existe`,
        "Se intentó añadir un producto inexistente",
        EErrors.INVALID_TYPES_ERROR
      );
      throw err;
    } else if (productExists.stock === 0) {
      return null;
    }
    const product = {
      id: pid,
      quantity: 1,
    };

    //si ambos existen, se añade/incrementa el producto al carrito
    return await this.cartDao.addProduct(cid, product);
  };

  deleteProductFromCart = async (cid, pid) => {
    return this.cartDao.deleteItem(cid, pid);
  };

  updateCart = async (cid, products) => {
    const cart = await this.cartDao.get(cid);
    //Si el carrito no existe manda un mensaje de error
    if (!cart) {
      const err = new CustomError(
        "Error al actualizar el carrito",
        `El carrito con el id ${cid} no existe`,
        "Se intentó modificar un carrito inexistente",
        EErrors.INVALID_TYPES_ERROR
      );
      throw err;
    }

    //primero se valida que todos los productos a modificar, existan
    products.forEach(async (product) => {
      const productExists = await this.productDao.getById(product.productId);
      if (!productExists) {
        const err = new CustomError(
          "Error al actualizar el carrito",
          `El producto con el id ${product.productId} no existe.`,
          "Se intentó modificar el carrito con un producto inexistente.",
          EErrors.INVALID_TYPES_ERROR
        );
        throw err;
      }
    });

    return await this.cartDao.updateCart(cid, products);
  };

  updateProductQuantity = async (cid, pid, quantity) => {
    const cart = await this.cartDao.get(cid);
    const productExists = await this.productDao.getById(pid);
    //Si el carrito no existe manda un mensaje de error
    if (!cart) {
      const err = new CustomError(
        "Error al actualizar el carrito",
        `El carrito con el id ${cid} no existe`,
        "Se intentó modificar un carrito inexistente",
        EErrors.INVALID_TYPES_ERROR
      );
      throw err;
      //y si el producto no existe, manda mensaje de error
    } else if (!productExists) {
      const err = new CustomError(
        "Error al actualizar el carrito",
        `El producto con el id ${pid} no existe.`,
        "Se intentó modificar el carrito con un producto inexistente.",
        EErrors.INVALID_TYPES_ERROR
      );
      throw err;
    }

    const product = {
      id: pid,
      quantity: quantity,
    };

    return await this.cartDao.updateProductQuantity(cid, product);
  };

  deleteAllProductsFromCart = async (cid) => {
    return await this.cartDao.delete(cid);
  };
}
