const { findAllUsers } = require("../services/users.service");

const getAll = async (req, res, next) => {
  try {
    const id = req.user;
    const users = await findAllUsers(id);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll };
