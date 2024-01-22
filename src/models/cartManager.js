import fs from "fs";

/**
 * Clase CartManager, se utiliza para crear y obtener los carritos en el JSON.
 * Recibe como parametro en el constructor el path de la ruta del archivo JSON.
 */
export default class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  /**
   * Función asínconra para obtener los carritos desde el JSON y llenar el
   * arreglo de carts.
   * @returns null si no hay un error o si el archivo no existe (porque no se
   * ha crado ningún carrito), o la promesa rechazada con el error al
   * intentar leer el archivo.
   */
  async getCartsFromDB() {
    try {
      //Lee el archivo
      const data = await fs.promises.readFile(this.path, "utf8");
      //Parsea el resultado y lo guarda en el arrelgo
      this.carts = JSON.parse(data);
      return null;
    } catch (error) {
      //Si da un error -4058 es que el archivo no existe, no se ha creado.
      if (error.errno === -4058) {
        console.error("El archivo no existe.");
        return null;
      }
      //cualquier otro error, muestra el mensaje de dicho error y rechaza la promesa.
      else {
        console.error("Error al leer el archivo.", error);
        return Promise.reject("Error al leer el archivo, " + error);
      }
    }
  }

  /**
   * Función asíncrona para crear un carrito vacío.
   * @returns el carrito creado o si hubo un error, la promesa rechazada.
   */
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
      //Si hubo un error al escribir en el archivo, se rechaza la promesa con el error
      console.error("Error al escribir en el archivo", error);
      return Promise.reject("Error al escribir en el archivo, " + error);
    }
  }

  /**
   * Función asúncona para obtener un carrito según su id.
   * @param {*} id del carrito
   * @returns el carrito si lo encontró o rechaza la promesa si el carrito no
   * existe.
   */
  async getCart(id) {
    //Obtener los datos de la "base de datos" antes de buscar en el carrito
    const resultDB = await this.getCartsFromDB();
    /** si el resultado es null no hay problema se puede continuar, sino,
     *  hubo un error y hay que regresar ese error al cliente
     * */
    if (resultDB !== null) return resultDB;

    //Busca en el arreglo de carritos si existe un carrito con el id del parámetro
    const cart = this.carts.find((c) => c.id === id);
    if (!cart) {
      //Si no existe el carrito, rechaza la promesa-
      console.error("El carrito no existe");
      return Promise.reject("El carrito no existe");
    }
    return cart;
  }

  /**
   * Función asínconrea para añadir un producto a un carrito.
   * @param {*} cid el id del carrito
   * @param {*} pid el id del producto
   * @returns el carrito con el producto añadido o si hubo un error,
   * la promesa rechazada con el mensaje de error.
   */
  async addProductToCart(cid, pid) {
    //Obtiene el carrito desde su id
    const cart = await this.getCart(cid);
    //Si no existe el carrito, rechaza la promesa
    if (!cart) {
      console.error("El carrito no existe");
      return Promise.reject("El carrito no existe");
    }

    //Obtiene el arreglo de products del carrito
    const products = cart.products;
    //Busca el index del producto a añadir
    const productIndex = products.findIndex((product) => product.id === pid);
    //Busca el índice del carrito en el arrelgo de carritos
    const cartIndex = this.carts.findIndex((c) => c.id === cid);

    console.log("cart=", cart);
    console.log("products=", products);
    console.log("productIndex=", productIndex);

    //Si el index es -1 es que no existe el producto en el carrito y hay que añadirlo.
    if (productIndex === -1) {
      //Crea un producto con el id correspondiente y la cantidad en 1
      const product = {
        id: pid,
        quantity: 1,
      };
      //Añade el producto al arreglo de products del carrito
      this.carts[cartIndex].products.push(product);
      //cart.products.push(product);
      //regresa el carrito
      //return cart;
    } else {
      //De lo contrario, solo se aumenta la cantidad mas 1
      this.carts[cartIndex].products[productIndex].quantity += 1;
    }

    //Reescribe al archivo JSON con el contenido el carrito actualizado
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
      return cart;
    } catch (error) {
      //Si hubo un error, rechaza la promesa con el mensaje de error.
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
    //Si el tamaño del arrego es 0, regresa 0
    if (this.carts.length === 0) return 0;
    //Sino, obtiene el último id de carts
    const lastCartId = this.carts[this.carts.length - 1].id;
    console.log("Last product id=", lastCartId);
    //regresa el último id
    return lastCartId;
  }
}
