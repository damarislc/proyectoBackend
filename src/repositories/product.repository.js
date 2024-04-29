import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = async (params) => {
    //Se crea el filtro con base a los parametros mandados (si es que se mando alguno)
    const filter = {};
    if (params.status) filter.status = params.status;
    if (params.category) filter.category = params.category;
    //se crea el objeto con las options para el paginate
    const options = {
      limit: params.limit,
      page: params.page,
      lean: true,
    };
    //si el parametro sort contiene un valor, se le asigna al options
    if (params.sort) options.sort = { price: params.sort };

    //se llama al método del dao con los filtros y options
    return await this.dao.gets(filter, options);
  };

  createProduct = async (newProduct) => {
    let productDB = await this.dao.getByCode(newProduct.code);
    //Si el codigo del producto ya existe significa que el prodycto ya existe.
    if (productDB) {
      const err = new CustomError(
        "Error al crear el producto",
        `El producto con el código "${newProduct.code}" ya existe.`,
        "Código del producto repetido, no se agregará a la base de datos.",
        EErrors.INVALID_TYPES_ERROR
      );
      throw err;
    }

    return await this.dao.create(newProduct);
  };

  getProductById = async (id) => {
    return await this.dao.getById(id);
  };

  updateProduct = async (id, productUpdated) => {
    //si no se está cambiando el código entonces no requiere más validaciones
    if (!productUpdated.code) return await this.dao.update(id, productUpdated);
    let productBefore = await this.dao.getById(id);
    //Si es el mismo código, no requiere más validaciones
    if (productBefore.code === productUpdated.code)
      return await this.dao.update(id, productUpdated);
    //sino, se busca que el nuevo código no exista ya en la base de datos
    let productDB = await this.dao.getByCode(productUpdated.code);
    if (productDB) {
      const err = new CustomError(
        "Error al actualizar el producto",
        `El producto con el código "${productUpdated.code}" ya existe.`,
        "Código del producto repetido, no se modificará el producto.",
        EErrors.INVALID_TYPES_ERROR
      );
      throw err;
    }

    //si no existia, entonces se actualiza el producto
    return await this.dao.update(id, productUpdated);
  };

  deleteProduct = async (id) => {
    return await this.dao.delete(id);
  };

  getProductStock = async (pid) => {
    return await this.dao.getStock(pid);
  };

  updateProductStock = async (pid, newStock) => {
    return await this.dao.updateStock(pid, newStock);
  };
}
