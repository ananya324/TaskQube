const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");

const registerService = async ({
  name,
  email,
  password,
}) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(
    password,
    salt
  );

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  };
};

module.exports = {
  registerService,
};