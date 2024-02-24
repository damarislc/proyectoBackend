import fs from "fs";
import cartModel from "./models/cart.model.js";
import productModel from "./models/product.model.js";

/**
 * Clase CartManager, se utiliza para crear y obtener los carritos en la BD.
 */
export default class CartManager {
  constructor() {}

  /**
   * Método asíncrona para crear un carrito vacío.
   * @returns el carrito creado o si hubo un error, la promesa rechazada.
   */
  async addCart() {
    try {
      //Se crea un carrito con un arreglo de productos vacio
      const cart = cartModel.create({ products: [] });
      return cart;
    } catch (error) {
      //Si hubo un error, se rechaza la promesa con el error
      console.error("Error al crear el carrito", error);
      return Promise.reject("Error al crear el carrito, " + error);
    }
  }

  /**
   * Método asincrona para obtener un carrito según su id.
   * @param {*} id del carrito
   * @returns el carrito si lo encontró o rechaza la promesa si el carrito no
   * existe.
   */
  async getCart(id) {
    try {
      const cart = cartModel.findById({ _id: id });
      //Si el carrito no existe, manda un error
      if (!cart) {
        console.error("El carrito no existe");
        return Promise.reject("El carrito no existe");
      }
      return cart;
    } catch (error) {
      console.error("Error al leer la base de datos.", error);
      return Promise.reject("Error al leer la base de datos, " + error);
    }
  }

  /**
   * Método asíncrono para añadir un producto a un carrito.
   * @param {*} cid el id del carrito
   * @param {*} pid el id del producto
   * @returns el carrito con el producto añadido o si hubo un error,
   * la promesa rechazada con el mensaje de error.
   */
  async addProductToCart(cid, pid) {
    try {
      //Primero busca si el carrito existe
      const cart = await cartModel.findById(cid);
      //Despues, si el producto añadir existe
      const productExists = await productModel.findById(pid);
      //Si el carrito no existe manda un mensaje de error
      if (!cart) {
        console.error("El carrito no existe");
        return Promise.reject("El carrito no existe");
        //y si el producto no existe, manda mensaje de error
      } else if (!productExists) {
        console.error("El producto no existe");
        return Promise.reject("El producto no existe");
      }

      const products = cart.products;
      //Busca el indice del producto dentro del arreglo de products del carrito
      const productIndex = products.findIndex((product) => product._id == pid);

      //si no existe el indice es que el carrito no se ha añadio anteriomente
      if (productIndex === -1) {
        //se crea un nuevo producto con el id y la cantidad en 1
        const newProduct = {
          _id: pid,
          quantity: 1,
        };

        //se añade al arreglo de produtos
        products.push(newProduct);

        //y se actualiza la coleccoin de cart en donde el id corresponda al carrito a actualizar
        //y retorna el resultado de la actualización
        return await cartModel.updateOne(
          { _id: cid },
          { $set: { products: products } }
        );
      }

      //si no entro al if anterior, entonces se incrementa la cantidad del producto en el arrelgo
      products[productIndex].quantity += 1;

      //y se acuatiliza el carrito correspondiente
      return await cartModel.updateOne(
        { _id: cid },
        { $set: { products: products } }
      );
    } catch (error) {
      //Si hubo un error, rechaza la promesa con el mensaje de error.
      console.error("Error al añadir el carrito", error);
      return Promise.reject("Error al añadir el carrito, " + error);
    }
  }
}
