const jwt = require("jsonwebtoken");
const CustomError = require("../exceptions/CustomException");

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    next(new CustomError("Headers not found", 401));
  } else if (!authHeader?.startsWith("Bearer ")) {
    next(new CustomError("Unauthorized", 401));
  } else {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if(err instanceof jwt.TokenExpiredError)next(new CustomError("Expired token", 401));
        if(err instanceof jwt.JsonWebTokenError)next(new CustomError("Invalid token", 401));
      } else {
        req.user = decoded.userInfo.id;
        next();
      }
    });
  }
};

module.exports = verifyJWT;
