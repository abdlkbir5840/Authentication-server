const CustomError = require("../exceptions/CustomException");
const { findAll } = require("../repositories/user.repository");

const findAllUsers = async (id) => {
  //I didn't use the id parameter because I just 
  //want to show that I can pass the role from methode jwt verify
  const users = await findAll();
  return users;
};

module.exports = { findAllUsers };
