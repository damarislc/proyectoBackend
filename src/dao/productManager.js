import fs from "fs";
import productModel from "./models/product.model.js";

/**
 * Clase ProductManager, se utiliza para crear y obtener los productos en la BD.
 */
export default class ProductManager {
  constructor() {}

  /**
   * Método addProduct busca en la base de datos si el producto ya existe con base en
   * el "code", si no existe, lo añade a la BD.
   * @param {*} newProduct un objeto de producto
   * @returns Promise, ya sea el producto o el rechazado con el mensaje de error.
   */
  async addProduct(newProduct) {
    let productDB = await productModel.findOne({ code: newProduct.code });

    //Si el codigo del producto ya existe significa que el prodycto ya existe.
    if (productDB) {
      console.log(
        `El producto con el código "${newProduct.code}" ya existe, no se agregará a la base de datos".`
      );
      return Promise.reject(
        `El producto con el código "${newProduct.code}" ya existe, no se agregará a la base de datos".`
      );
    }

    //Si hay campos vacíos, rechaza la promesa y manda un mensaje para que se completen todos los campos.
    if (
      !(
        newProduct.title &&
        newProduct.description &&
        newProduct.code &&
        newProduct.price &&
        newProduct.stock &&
        newProduct.category
      )
    ) {
      console.log(
        "Los campos title, description, code, price, stock y category son requeridos."
      );

      return Promise.reject(
        "Los campos title, description, code, price, stock y category son requeridos."
      );
    }

    //Si no trae un estatus por defecto, entonces el estatus es true
    const status = newProduct.status ? newProduct.status : true;

    //Crea un nuevo producto
    const product = { ...newProduct, status };

    try {
      //crea el documento en la colección de products con el producto recibido
      return await productModel.create({ ...product });
    } catch (error) {
      console.error("Error al crear el producto en la BD", error);
      return Promise.reject("Error al crear el producto en la BD, " + error);
    }
  }

  /**
   * Método getProducts para obtener el arreglo de todos los productos desde la BD
   * @returns la promesa de los productos.
   */
  async getProducts() {
    try {
      return await productModel.find();
    } catch (error) {
      console.error("Error al leer la base de datos.", error);
      return Promise.reject("Error al leer la base de datos, " + error);
    }
  }

  /**
   * Método getProductById para obtener el producto según su id.
   * Busca en la BD el producto con el id
   * @param {*} id del producto
   * @returns regresa el producto si lo encuentra o null.
   */
  async getProductById(id) {
    try {
      //Busca en la colección el producto que coincida con el id
      return await productModel.findById({ _id: id });
    } catch (error) {
      console.error("Error al leer la base de datos.", error);
      return Promise.reject("Error al leer la base de datos, " + error);
    }
  }

  /**
   * Método para actualizar un producto
   * @param {*} id el id del producto a actualizar
   * @param {*} productUpdated el producto con el/los campos modificados
   * @returns Promise, el resultado de la actualización o la promesa rechazada
   *          con el mensaje de error
   */
  async updateProduct(id, productUpdated) {
    try {
      //busca el producto a actualizar y modificado solo los campos enviados en productUpdated
      return await productModel.findOneAndUpdate(
        { _id: id },
        { $set: productUpdated }
      );
    } catch (error) {
      console.error("Error al actualizar el producto", error);
      return Promise.reject("Error al actualizar el producto, " + error);
    }
  }

  /**
   * Método para eliminar un producto según su id.
   * @param {*} id el id del producto a eliminar
   * @returns Promise, ya sea el resultado o la promesa rechazada
   *          con el mensaje de error
   */
  async deleteProduct(id) {
    try {
      //elimina de la colección el producto con el id correspondiente
      return await productModel.deleteOne({ _id: id });
    } catch (error) {
      console.error("Error al eliminar el producto", error);
      return Promise.reject("Error al eliminar el producto, " + error);
    }
  }
}
