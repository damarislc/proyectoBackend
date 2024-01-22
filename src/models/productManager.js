import fs from "fs";

/**
 * Clase ProductManager, se utiliza para crear y obtener los productos en el JSON.
 * Recibe como parametro en el constructor el path de la ruta del archivo JSON.
 */
export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  /**
   * Método addProduct, manda a llamar el método getProducts para obtener los productos
   * desde el JSON y buscar si ya existe el producto, si ya existe, no lo agrega.
   * Si no existe, lo añade al arreglo y el archivo JSON.
   * @param {*} es un objeto de producto
   * @returns Promise, ya sea el producto o el rechazado con el mensaje de error.
   */
  async addProduct(newProduct) {
    //Obtiene todos los productos desde el JSON y los añade al arreglo
    await this.getProducts();
    /*Si el codigo del producto y titulo ya existen, rechaza la promesa y manda mensaje de que el producto ya existe 
    y no lo agrega */
    if (
      this.products.some((product) => product.code === newProduct.code) &&
      this.products.some((product) => product.title === newProduct.title)
    ) {
      console.log(
        `El producto "${newProduct.title}" ya existe, no se agregará a la lista.`
      );
      return Promise.reject(
        `El producto "${newProduct.title}" ya existe, no se agregará a la lista.`
      );
    }
    //Si el codigo del producto ya existe rechaza la promesa y manda un mensaje para que se cambie el código.
    if (this.products.some((product) => product.code === newProduct.code)) {
      console.log(
        `El codigo "${newProduct.code}" ya existe, favor de cambiarlo en el producto "${newProduct.title}".`
      );
      return Promise.reject(
        `El codigo "${newProduct.code}" ya existe, favor de cambiarlo en el producto "${newProduct.title}".`
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

    //Crea el id para el nuevo producto
    const id = this.setId();
    //Crea un nuevo producto con el id y el estatus añadido.
    const product = { id, ...newProduct, status };
    //añade el nuevo producto con el id al arreglo
    this.products.push(product);

    //Crea al archivo JSON con el contenido del arreglo
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      return product;
    } catch (error) {
      console.error("Error al escribir en el archivo", error);
      return Promise.reject("Error al escribir en el archivo, " + error);
    }
  }

  /**
   * Método getProducts para obtener el arreglo de todos los productos,
   * lee el archivo json y luego parsea los datos al arreglo.
   * @returns la promesa de los productos.
   */
  async getProducts() {
    try {
      //Lee el archivo JSON
      const data = await fs.promises.readFile(this.path, "utf8");
      //Parsea el contenido y lo asigna al arreglo de la clase
      this.products = JSON.parse(data);
    } catch (error) {
      //Si da un error -4058 es que el archivo no existe
      if (error.errno === -4058) console.error("El archivo no existe.");
      //cualquier otro error, muestra el mensaje de dicho error.
      else {
        console.error("Error al leer el archivo.", error);
        return Promise.reject("Error al leer el archivo, " + error);
      }
    }

    return this.products;
  }

  /**
   * Método getProductById para obtener el producto según su id. Obtiene primero todos los productos
   * para popular el arreglo desde el archivo y luego buscar el objeto por el id.
   * @param {*} id
   * @returns regresa el producto si lo encuentra o rechaza la promesa si no lo encontró.
   */
  async getProductById(id) {
    //Obtiene todos los productos desde el JSON y los añade al arreglo
    await this.getProducts();
    const product = this.products.find((product) => product.id === id);
    //Si el producto no existe, rechaza la promesa y manda el error.
    if (product === undefined)
      return Promise.reject(`El producto con el id ${id} no existe`);
    return product;
  }

  /**
   * Método para actualizar un objeto
   * @param {*} id el id del objeto a actualizar
   * @param {*} productUpdated el objeto con el/los campos modificados
   * @returns Promise, ya sea el producto actualizado o la promesa rechazada
   *          con el mensaje de error
   */
  async updateProduct(id, productUpdated) {
    //Obtiene todos los productos desde el JSON y los añade al arreglo
    await this.getProducts();

    //Si el id no existe, muestra un mensaje de error y rechaza la promesa
    if (this.products.find((product) => product.id === id) === undefined) {
      console.error(
        `El id ${id} no existe, no se puede actualizar el producto.`
      );
      return Promise.reject(
        `El id ${id} no existe, no se puede actualizar el producto.`
      );
    }

    const objIndex = this.products.findIndex((product) => product.id === id);
    const productBefore = this.products[objIndex];
    //Si el codigo del producto no es el mismo que el que tenia orginalmente y si incluye el codigo en el cambio
    if (productBefore.code !== productUpdated.code && productUpdated.code) {
      //Verifica si el codigo ya existe para rechazar la promesa y manda un mensaje para que se cambie el código.
      if (
        this.products.some((product) => product.code === productUpdated.code)
      ) {
        console.log(
          `El codigo "${productUpdated.code}" ya existe, favor de cambiarlo en el producto "${productUpdated.title}".`
        );
        return Promise.reject(
          `El codigo "${productUpdated.code}" ya existe, favor de cambiarlo en el producto "${productUpdated.title}".`
        );
      }
    }

    //Crea un nuevo producto con los campos que tenia anteriormente mas los campos actualizados
    const newProduct = { ...productBefore, ...productUpdated };
    //Y lo reemplaza en la misma posicion del arreglo
    this.products[objIndex] = newProduct;

    //Reescribe al archivo JSON con el contenido del objeto actualizado
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      return newProduct;
    } catch (error) {
      console.error("Error al escribir en el archivo", error);
      return Promise.reject("Error al escribir en el archivo, " + error);
    }
  }

  /**
   * Método para eliminar un producto según su id.
   * @param {*} id el id del producto a eliminar
   * @returns Promise, ya sea el producto eliminado o la promesa rechazada
   *          con el mensaje de error
   */
  async deleteProduct(id) {
    //Obtiene todos los productos desde el JSON y los añade al arreglo
    await this.getProducts();
    //Si el id no existe, muestra un mensaje de error y rechaza la promesa
    if (this.products.find((product) => product.id === id) === undefined) {
      console.error(`El id ${id} no existe, no se puede eliminar el producto.`);
      return Promise.reject(
        `El id ${id} no existe, no se puede eliminar el producto.`
      );
    }

    //Obtiene el index en el array del objeto con el id a eliminar
    const objIndex = this.products.findIndex((product) => product.id === id);
    //guarda el objeto antes de borrarlo para devovler la promesa
    const product = this.products[objIndex];
    this.products.splice(objIndex, 1);

    //Reescribe el archivo con el objeto borrado
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      return product;
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
    this.lastId = this.getLastProductId();
    if (this.lastId === 0) this.lastId = 1;
    else this.lastId++;
    return this.lastId;
  }

  /**
   * Método para obtener el último id del arreglo, si el arreglo no
   * tiene ningún objeto, devuelve 0.
   * @returns el último id de product o 0
   */
  getLastProductId() {
    if (this.products.length === 0) return 0;
    const lastProductId = this.products[this.products.length - 1].id;
    console.log("Last product id=", lastProductId);
    return lastProductId;
  }
}
