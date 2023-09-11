const express = require('express');
const authRouter = express.Router();
const {register, login, refresh, logout} = require('../controllers/auth.controller')

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/refresh').get(refresh);
authRouter.route('/logout').post(logout);

module.exports = authRouter;