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

    try {
      //se llama al método del dao con los filtros y options
      return await this.dao.gets(filter, options);
    } catch (error) {
      return Promise.reject("Error al obtener los productos: " + error);
    }
  };

  createProduct = async (newProduct) => {
    let productDB = await this.dao.getByCode(newProduct.code);
    //Si el codigo del producto ya existe significa que el prodycto ya existe.
    if (productDB) {
      return Promise.reject(
        `El producto con el código "${newProduct.code}" ya existe, no se agregará a la base de datos".`
      );
    }

    try {
      return await this.dao.create(newProduct);
    } catch (error) {
      return Promise.reject("Error al crear el producto en la BD: " + error);
    }
  };

  getProductById = async (id) => {
    try {
      return await this.dao.getById(id);
    } catch (error) {
      return Promise.reject(`Error al obtener el producto: ` + error);
    }
  };

  updateProduct = async (id, productUpdated) => {
    try {
      return await this.dao.update(id, productUpdated);
    } catch (error) {
      return Promise.reject("Error al actualizar el producto: " + error);
    }
  };

  deleteProduct = async (id) => {
    try {
      return await this.dao.delete(id);
    } catch (error) {
      return Promise.reject("Error al eliminar el producto: " + error);
    }
  };

  getProductStock = async (pid) => {
    try {
      return await this.dao.getStock(pid);
    } catch (error) {
      return Promise.reject("Error al obtener el stock del producto: " + error);
    }
  };

  updateProductStock = async (pid, newStock) => {
    try {
      return await this.dao.updateStock(pid, newStock);
    } catch (error) {
      return Promise.reject(
        "Error al actualizar el stock del producto: " + error
      );
    }
  };
}
