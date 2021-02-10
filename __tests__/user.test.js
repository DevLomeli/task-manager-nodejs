const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOne, userOneId, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("should signup a new user ", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "testUser2",
      email: "testUser2@gmail.com",
      password: "testpassword2",
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  //expect(response.body.user.name).toBe("testUser2");
  expect(response.body).toMatchObject({
    user: {
      name: "testUser2",
      email: "testuser2@gmail.com",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("testpassword2");
});

test("should login an existen user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body).toMatchObject({
    token: user.tokens[1].token,
  });
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

test("should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "__tests__/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "testUserNew" })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("testUserNew");
});

test("should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ lastname: "lomeli" })
    .expect(400);
});
