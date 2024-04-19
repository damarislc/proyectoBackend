import cartModel from "./models/cart.model.js";

export default class CartDao {
  constructor() {
    this.cartModel = cartModel;
  }

  async get(id) {
    return await this.cartModel.findById(id).populate("products.productId");
  }

  async create() {
    return cartModel.create({});
  }

  async addProduct(cid, product) {
    const updatedCart = await this.cartModel.findOneAndUpdate(
      {
        _id: cid,
        "products.productId": product.id,
      },
      { $inc: { "products.$.quantity": product.quantity } }
    );

    //si el producto ya existia, se actualizó su cantidad
    if (updatedCart) return updatedCart;

    //el producto no existía y se agregó con quantity en 1
    return await this.cartModel.findOneAndUpdate(
      { _id: cid },
      {
        $push: {
          products: { productId: product.id, quantity: product.quantity },
        },
      },
      { new: true, upsert: true }
    );
  }

  async updateCart(cid, products) {
    return await this.cartModel.findOneAndUpdate(
      { _id: cid },
      { $set: { products } },
      {
        new: true,
        upsert: true,
      }
    );
  }

  async updateProductQuantity(cid, product) {
    const updatedCart = await this.cartModel.findOneAndUpdate(
      {
        _id: cid,
        "products.productId": product.id,
      },
      { $set: { "products.$.quantity": product.quantity } },
      { new: true }
    );

    //si el producto ya existia, se actualizó su cantidad
    if (updatedCart) return updatedCart;

    //el producto no existía y se agregó con el quantity correspondiente
    return await this.cartModel.findOneAndUpdate(
      { _id: cid },
      {
        $push: {
          products: { productId: product.id, quantity: product.quantity },
        },
      },
      { new: true, upsert: true }
    );
  }

  async deleteItem(cid, pid) {
    return await this.cartModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { productId: pid } } },
      { new: true }
    );
  }

  async delete(id) {
    return await this.cartModel.findOneAndUpdate(
      { _id: id },
      { $set: { products: [] } },
      { new: true }
    );
  }
}
