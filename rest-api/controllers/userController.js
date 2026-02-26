const User = require("../models/userModel");

const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};


const createUser = async (req, res) => {
  const user = await User.create({
    name: req.body.name
  });

  res.status(201).json(user);
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name;
  const updatedUser = await user.save();

  res.json(updatedUser);
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();
  res.json({ message: "User deleted" });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
