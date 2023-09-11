const express = require("express");
const { getAll } = require("../controllers/users.controller");
const verifyJWT = require("../middlewares/verifyJWT");
const errorHandler = require("../middlewares/errorHandler");


const userRouter = express.Router();

userRouter.use(verifyJWT);
userRouter.use(errorHandler)
userRouter.route('/').get(getAll);

module.exports = userRouter;
