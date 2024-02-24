import mongoose from "mongoose";

const productsCollection = "products";

/**
 * Schema de la coleccion products
 * contiene todos los elementos del producto.
 */
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 150 },
  description: { type: String, required: true, max: 300 },
  code: { type: String, required: true, max: 10, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: false, default: true },
  stock: { type: Number, required: true, integer: true },
  category: { type: String, required: true, max: 20 },
  thumbnail: { type: Array, required: false },
});

const productModel = mongoose.model(productsCollection, productSchema);

export default productModel;
