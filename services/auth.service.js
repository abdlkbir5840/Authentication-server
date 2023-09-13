const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CustomError = require("../exceptions/CustomException");
const {
  findUserByEmail,
  save,
  findUserById,
} = require("../repositories/user.repository");

const registerUser = async (user) => {
  //Destructuring user data from request body
  const { name, email, password } = user;

  //Check if any of the required fields are missing
  if (!name || !email || !password) {
    //If any required fields is missing throw a validation error
    throw new CustomError("All fields are mandatory", 400);
  }
  //Check if a user waith the same email already exist in the database
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    //If a user with the same email exists throw a conflict error
    throw new CustomError("User already exists", 409);
  }
  //Create a new user in the database
  const savedUser = await save(user);

  //Create an access token for the user
  const accessToken = jwt.sign(
    {
      userInfo: {
        id: savedUser.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5m" }
  );

  //Create a refresh token for the user
  const refreshToken = jwt.sign(
    {
      userInfo: {
        id: savedUser.id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    name: savedUser.name,
    email: savedUser.email,
  };
};

const loginUser = async (user) => {
  //Destructuring user data from request body
  const { email, password } = user;

  //Check if any of the required fields are missing
  if (!email || !password) {
    //If any required fields is missing throw a validation error
    throw new CustomError("All fields are mandatory", 400);
  }
  //Check if a user waith the email exist in the database
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    //If a user with the email not exists throw a Credential error
    throw new CustomError("Credential not valid", 401);
  }
  //Compare the provided password with the stored password hash
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    //If the provided password and stored password dosen't match throw unauthorized error
    throw new CustomError("Authentication failed", 401);
  }

  //Create an access token for the user
  const accessToken = jwt.sign(
    {
      userInfo: {
        id: existingUser.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" }
  );

  //Create a refresh token for the user
  const refreshToken = jwt.sign(
    {
      userInfo: {
        id: existingUser.id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    name: existingUser.name,
    email: existingUser.email,
  };
};
const refreshUser = async (cookie) => {
  if (!cookie?.jwt) {
    throw new CustomError("Unauthorized", 401);
  }
  const refreshToken = cookie.jwt;
  let accessToken;
  await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err instanceof jwt.TokenExpiredError)
        throw new CustomError("Expired token", 401);
      if (err instanceof jwt.JsonWebTokenError)
        throw new CustomError("Invalid token", 401);
      const existingUser = await findUserById(decoded.userInfo.id);
      if (!existingUser) {
        throw new CustomError("User not found", 401);
      }
      //Create an access token for the user
      accessToken = jwt.sign(
        {
          userInfo: {
            id: existingUser.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );
    }
  );
  return accessToken;
};

const logoutUser = async (cookie) => {
  if(!cookie?.jwt){
    throw new CustomError('Unauthorized', 401)
  }
}
module.exports = { registerUser, loginUser, refreshUser, logoutUser };
