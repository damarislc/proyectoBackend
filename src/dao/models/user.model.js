import mongoose from "mongoose";

/**
 * Modelo para la coleccion de users
 */
const usersCollection = "users";

const userSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts", required: true },
  role: { type: String, enum: ["admin", "user", "premium"], default: "user" },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
  },
  last_connection: Date,
  /*  isPremium: {
    type: Boolean,
    default: false,
  }, */
});

const userModel = mongoose.model(usersCollection, userSchema);

export default userModel;
