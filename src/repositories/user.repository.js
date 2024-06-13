export default class UserRepository {
  constructor(dao) {
    this.userDao = dao;
  }

  getUsers = async () => {
    return await this.userDao.get();
  };

  getUser = async (uid) => {
    return await this.userDao.getById(uid);
  };

  getUserByEmail = async (email) => {
    return await this.userDao.getBy(email);
  };

  createUser = async (newUser) => {
    return await this.userDao.create(newUser);
  };

  updatePassword = async (user) => {
    return await this.userDao.updatePassword(user);
  };

  updateUserRole = async (uid, role) => {
    const user = await this.userDao.getById(uid);
    user.role = role;

    return await this.userDao.updateUserRole(user);
  };

  deleteUser = async (email) => {
    return await this.userDao.delete(email);
  };
}
