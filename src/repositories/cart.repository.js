export default class CartRepository {
  constructor(cartDao, productDao) {
    this.cartDao = cartDao;
    this.productDao = productDao;
  }

  createCart = async () => {
    try {
      return await this.cartDao.create();
    } catch (error) {
      return Promise.reject("Error al crear el carrito: " + error);
    }
  };

  getCart = async (id) => {
    try {
      return await this.cartDao.get(id);
    } catch (error) {
      return Promise.reject("Error al obtener el carrito: " + error);
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      const cart = await this.cartDao.get(cid);
      const productExists = await this.productDao.getById(pid);
      //Si el carrito no existe manda un mensaje de error
      if (!cart) {
        return Promise.reject("El carrito no existe");
        //y si el producto no existe, manda mensaje de error
      } else if (!productExists) {
        return Promise.reject("El producto no existe");
      } else if (productExists.stock === 0) {
        return null;
      }
      const product = {
        id: pid,
        quantity: 1,
      };

      //si ambos existen, se añade/incrementa el producto al carrito
      return await this.cartDao.addProduct(cid, product);
    } catch (error) {}
  };

  deleteProductFromCart = async (cid, pid) => {
    try {
      return this.cartDao.deleteItem(cid, pid);
    } catch (error) {
      return Promise.reject("Error al eliminar producto del carrito: " + error);
    }
  };

  updateCart = async (cid, products) => {
    try {
      const cart = await this.cartDao.get(cid);
      //Si el carrito no existe manda un mensaje de error
      if (!cart) {
        return Promise.reject("El carrito no existe");
        //y si el producto no existe, manda mensaje de error
      }

      //primero se valida que todos los productos a modificar, existan

      products.forEach(async (product) => {
        const productExists = await this.productDao.getById(product.productId);
        if (!productExists) {
          return Promise.reject(
            `El producto con el id ${product.productId} no existe`
          );
        }
      });

      return await this.cartDao.updateCart(cid, products);
    } catch (error) {
      return Promise.reject("Error al actualizar el carrito: " + error);
    }
  };

  updateProductQuantity = async (cid, pid, quantity) => {
    try {
      const cart = await this.cartDao.get(cid);
      const productExists = await this.productDao.getById(pid);
      //Si el carrito no existe manda un mensaje de error
      if (!cart) {
        return Promise.reject("El carrito no existe");
        //y si el producto no existe, manda mensaje de error
      } else if (!productExists) {
        return Promise.reject("El producto no existe");
      }

      const product = {
        id: pid,
        quantity: quantity,
      };

      return await this.cartDao.updateProductQuantity(cid, product);
    } catch (error) {
      return Promise.reject("Error al actualizar el carrito: " + error);
    }
  };

  deleteAllProductsFromCart = async (cid) => {
    try {
      return await this.cartDao.delete(cid);
    } catch (error) {
      return Promise.reject(
        "Error al borrar los productos del carrito: " + error
      );
    }
  };
}
