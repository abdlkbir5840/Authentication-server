const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");

const findAll = async () => {
    const users = await prisma.user.findMany({
      select:{
        id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      }
    });
    if(!users.length){
      return {message: 'No user found'}
    }
    return users;
  };

const findUserByEmail = async (email) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return user;
};

const findUserById = async (id) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
  return user;
};

const save = async (user) => {
  const { name, email, password } = user;
  //Hash the user password for security
  const hashedPassword = await bcrypt.hash(password, 10);
  const savedUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });
  return savedUser;
};

module.exports = {  
  findAll,
  findUserByEmail,
  findUserById,
  save,
};
