import userModel from "./models/user.model.js";

export default class UserDao {
  constructor() {
    this.userModel = userModel;
  }

  async get() {
    return await this.userModel.find();
  }

  async getBy(email) {
    return await this.userModel.findOne({ email });
  }

  async getById(id) {
    return await this.userModel.findById(id);
  }

  async create(newUser) {
    return await this.userModel.create(newUser);
  }

  async updatePassword(user) {
    return await this.userModel.updateOne(
      { email: user.email },
      { password: user.password }
    );
  }

  async updateUserRole(user) {
    return await this.userModel.updateOne(
      { email: user.email },
      { role: user.role }
    );
  }

  async delete(email) {
    return await this.userModel.deleteOne({ email: email });
  }
}
