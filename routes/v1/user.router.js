const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../../controllers/v1/user.controller');
const { restrictTo } = require('../../middlewares/auth.middleware');
const { UserRoles } = require('../../services/staticLookups');

const userRouter = express.Router();

// ? Restrict all routes after this middleware
userRouter.use(restrictTo([UserRoles.ADMIN]));
userRouter.route('/').get(getAllUsers);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = { userRouter };
