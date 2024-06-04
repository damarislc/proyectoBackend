import * as chai from "chai";
import supertest from "supertest";
import config from "../src/config/config.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

//Variables globales para testing
const userMock = {
  name: "Peter",
  lastname: "Parker",
  email: "peter.parker@gmail.com",
  age: "15",
  password: "123456",
  premium: "premium",
  role: "premium",
};

const productMock = {
  title: "Cuaderno Scribe",
  description: "Cuaderno marca Scribe color verde de rallas, 100 hojas",
  code: "CS123",
  price: 50,
  status: true,
  stock: 5,
  category: "Papeleria",
  owner: "peter.parker@gmail.com",
};

let cookie;
let _pid = "";

describe("Testing página eCommerce", () => {
  describe("Testing sessions", () => {
    it("El endpoint debe de registrar el usuario correctamente", async () => {
      const { statusCode, _body } = await requester
        .post("/api/sessions/register")
        .send(userMock);

      expect(statusCode).to.equal(200);
      expect(_body.success).to.be.true;
    });

    it("El endpoint no debe de registrar a un usuario con un email que ya existe", async () => {
      const { statusCode, _body } = await requester
        .post("/api/sessions/register")
        .send(userMock);

      expect(statusCode).to.equal(400);
      expect(_body.success).to.be.false;
    });

    it("El endpoint debe loguear al usuario correctamente y genear una cookie", async () => {
      const result = await requester.post("/api/sessions/login").send({
        email: userMock.email,
        password: userMock.password,
      });

      const cookieResult = result.headers["set-cookie"][0];
      expect(cookieResult).to.be.ok;

      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };

      expect(cookie.name).to.be.ok.and.eql(config.tokenCookieName);
    });
  });

  describe("Testing products", () => {
    let pid = "";
    it("El endpoint debe crear un producto", async () => {
      const response = await requester
        .post("/api/products/")
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send(productMock);
      pid = response.body.payload._id;
      expect(response.statusCode).to.eq(201);
      expect(response.body.success).to.be.true;
      expect(response.body.payload).to.have.property("_id");
    });

    it("El endpoint debe obtener una lista de productos", async () => {
      const response = await requester
        .get("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      _pid = response.body.payload[0]._id;
      expect(response.statusCode).to.eq(201);
      expect(response.body.success).to.be.true;
      expect(Array.isArray(response.body.payload)).to.be.true;
    });

    it("El endpont debe obter un producto por su id", async () => {
      const response = await requester.get(`/api/products/${pid}`);
      expect(response.statusCode).to.eq(201);
      expect(response.body.success).to.be.true;
      expect(response.body.payload._id).to.be.eq(pid);
    });

    it("El endpont debe eliminar un producto", async () => {
      const response = await requester
        .delete(`/api/products/${pid}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(response.statusCode).to.eq(201);
      expect(response.body.success).to.be.true;
      expect(response.body.payload._id).to.be.eq(pid);
    });
  });

  describe("Testing carts", () => {
    //    /api/carts
    let cid = "";
    it("El endpoint debe crear un carrito vacio", async () => {
      const response = await requester.post("/api/carts");
      cid = response.body.payload._id;
      expect(response.statusCode).to.eq(201);
      expect(response.body.success).to.be.true;
      expect(response.body.payload).to.have.property("_id");
    });

    it("El endpoint debe añadir un producto al carrito", async () => {
      const response = await requester
        .post(`/api/carts/${cid}/product/${_pid}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(response.statusCode).to.eq(201);
      expect(response.body.success).to.be.true;
      expect(response.body.payload).to.be.not.empty;
    });

    it("El endpoint debe eliminar un producto del carrito", async () => {
      const response = await requester
        .delete(`/api/carts/${cid}/product/${_pid}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(response.statusCode).to.eq(201);
      expect(response.body.success).to.be.true;
      expect(response.body.payload.products).to.be.empty;
    });
  });

  describe("Testing users", () => {
    it("El endpoint debe eliminar al usuario correctamente", async () => {
      const result = await requester
        .delete("/api/user/")
        .send({ email: userMock.email });
    });
  });
});
