// Helpers
const factory = require('../../services/handlerFactory');
// Models
const { User } = require('../../models/v1/user.model');

const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
