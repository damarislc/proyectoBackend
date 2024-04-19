export default class UserDTO {
  constructor(user) {
    this.name = user.name;
    this.lastname = user.lastname;
    this.full_name = `${user.name} ${user.lastname}`;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
    this.cart = user.cart;
    this.isAdmin = user.role === "admin" ? true : false;
  }
}
