import productModel from "./models/product.model.js";

/**
 * Clase que controla el acceso a la BD para la colleción de Productos
 */
export default class ProductDao {
  constructor() {
    this.model = productModel;
  }

  /**
   * Devuelve todos los productos según el filtro y las opciones.
   * @param {*} filter el filtro si es que contiene alguno, que puede ser por estatus o por categoría
   * @param {*} options las opciones de la búsqueda, que pueden ser límite de productos, página o ordenamiento.
   * @returns la lista de los productos
   */
  async gets(filter, options) {
    return await this.model.paginate(filter, options);
  }

  /**
   * Busca a un producto por su ID
   * @param {*} id el ID del producto a buscar
   * @returns el producto encontrado
   */
  async getById(id) {
    return await this.model.findById(id);
  }

  /**
   * Busca un producto por su codigo
   * @param {*} code el codigo del producto
   * @returns el producto encontrado
   */
  async getByCode(code) {
    let result = await this.model.findOne({ code: code });
    return result;
  }

  /**
   * Crea un nuevo producto
   * @param {*} newProduct el objeto del nuevo producto
   * @returns el producto creado
   */
  async create(newProduct) {
    return await this.model.create(newProduct);
  }

  /**
   * Actualiza un producto
   * @param {*} id el ID del producto a actualizar
   * @param {*} productToUpdate el producto actualizado
   * @returns el producto antes de actualizarse
   */
  async update(id, productToUpdate) {
    //TODO verificar si se requiere el set
    /*
    const productBefore = await productModel.findOneAndUpdate(
        { _id: id },
        { $set: productUpdated }
      );
    */
    return this.model.findByIdAndUpdate({ _id: id }, productToUpdate, {
      new: true,
    });
  }

  /**
   * Cambia de estatus a false del producto según su ID
   * @param {*} id el ID del producto a eliminar
   * @returns el producto eliminado
   */
  async delete(id) {
    //return this.model.deleteOne({ _id: id });
    return await this.model.findByIdAndUpdate(
      { _id: id },
      { status: false },
      { new: true }
    );
  }

  async getStock(pid) {
    return await this.model.findOne({ _id: pid }).select("stock");
  }

  async updateStock(pid, newStock) {
    return await this.model.findOneAndUpdate(
      { _id: pid },
      { $set: { stock: newStock } }
    );
  }
}
