const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const userOne = {
  name: "testUser",
  email: "testUser@gmail.com",
  password: "testpassword",
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("should signup a new user ", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "testUser2",
      email: "testUser2@gmail.com",
      password: "testpassword2",
    })
    .expect(201);
});

test("should signin a user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "fail@gmail.com",
      password: "12345678",
    })
    .expect(400);
});
