import UserDao from "../dao/userDao.js";

export default class UserController {
  constructor() {
    this.userService = new UserDao();
  }
  getUsers = async (req, res) => {
    try {
      const users = await userService.get();
      res.send(users);
    } catch (error) {
      console.log(error);
    }
  };

  createUser = async (req, res) => {
    try {
      const { name, lastname, email } = req.body;
      const result = await userService.create({ name, lastname, email });
      res.status(201).send({ success: true, payload: result });
    } catch (error) {
      console.log(error);
    }
  };
}
