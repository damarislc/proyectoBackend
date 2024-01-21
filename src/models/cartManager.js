import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  async getCartsFromDB() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      this.carts = JSON.parse(data);
      return null;
    } catch (error) {
      //Si da un error -4058 es que el archivo no existe, hay que crearlo.
      if (error.errno === -4058) {
        console.error("El archivo no existe.");
        return null;
      }
      //cualquier otro error, muestra el mensaje de dicho error.
      else {
        console.error("Error al leer el archivo.", error);
        return Promise.reject("Error al leer el archivo, " + error);
      }
    }
  }

  async addCart() {
    //Obtener los datos de la "base de datos" antes de crear un carrito
    const resultDB = await this.getCartsFromDB();
    /** si el resultado es null no hay problema se puede continuar, sino,
     *  hubo un error y hay que regresar ese error al cliente
     * */
    if (resultDB !== null) return resultDB;

    //se crea el id
    const id = this.setId();

    //se crea un arreglo de productos vacio
    this.products = [];
    //se crea un objeto carrito con el id y el arrelgo
    const cart = {
      id: id,
      products: this.products,
    };
    //se cuarda el carrito en el arreglo de carritos
    this.carts.push(cart);

    //Se escribe el arreglo de carritos en el JSON
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
      return cart;
    } catch (error) {
      console.error("Error al escribir en el archivo", error);
      return Promise.reject("Error al escribir en el archivo, " + error);
    }
  }

  async getCart(id) {
    //Obtener los datos de la "base de datos" antes de buscar en el carrito
    const resultDB = await this.getCartsFromDB();
    /** si el resultado es null no hay problema se puede continuar, sino,
     *  hubo un error y hay que regresar ese error al cliente
     * */
    if (resultDB !== null) return resultDB;

    //TODO manejar cuando el archivo no existe! ya sea aqui o en el endpoint

    const cart = this.carts.find((c) => c.id === id);
    if (!cart) {
      console.error("El carrito no existe");
      return Promise.reject("El carrito no existe");
    }
    return cart;
  }

  async addProductToCart(cid, pid) {
    const cart = await this.getCart(cid);
    if (!cart) {
      console.error("El carrito no existe");
      return Promise.reject("El carrito no existe");
    }
    const products = cart.products;
    const productIndex = products.findIndex((product) => product.id === pid);

    if (productIndex === -1) {
      const product = {
        id: pid,
        quantity: 1,
      };
      cart.products.push(product);
      return cart;
    }

    const cartIndex = this.carts.findIndex((c) => c.id === cid);
    this.carts[cartIndex].products[productIndex].quantity += 1;

    console.log("cart stringifiado:");
    console.log(JSON.stringify(this.carts));

    /* console.log("product:");
    console.log(product); */
    console.log("product index:");
    console.log(productIndex);

    /* const product = {
      id: pid,
      quantity: 1,
    }; */

    //Reescribe al archivo JSON con el contenido el carrito actualizado
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
      return cart;
    } catch (error) {
      console.error("Error al escribir en el archivo", error);
      return Promise.reject("Error al escribir en el archivo, " + error);
    }
  }

  /**
   * Método para crear el id autoincremental.
   * @returns el nuevo id para el objeto.
   */
  setId() {
    this.lastId = this.getLastCartId();
    if (this.lastId === 0) this.lastId = 1;
    else this.lastId++;
    return this.lastId;
  }

  /**
   * Método para obtener el último id del arreglo, si el arreglo no
   * tiene ningún objeto, devuelve 0.
   * @returns el último id de product o 0
   */
  getLastCartId() {
    if (this.carts.length === 0) return 0;
    const lastCartId = this.carts[this.carts.length - 1].id;
    console.log("Last product id=", lastCartId);
    return lastCartId;
  }
}
