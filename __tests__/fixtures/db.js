const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userOneId = new mongoose.Types.ObjectId();
const User = require("../../src/models/user");

const userOne = {
  _id: userOneId,
  name: "testUser",
  email: "testUser@gmail.com",
  password: "testpassword",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
};

module.exports = {
  userOneId,
  userOne,
  setupDatabase,
};
