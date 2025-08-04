const express = require('express');
const { login, signup } = require('../../controllers/v1/auth.controller');

const authRouter = express.Router();

authRouter.route('/login').post(login);
authRouter.route('/signup').post(signup);

module.exports = { authRouter };
