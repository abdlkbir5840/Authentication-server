const { constants } = require("../utils/constant");
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;

  switch (statusCode) {
    case constants.NO_CONTENT:
      res.status(err.statusCode).json({
        title: "No Content",
        timstamp: new Date(),
        stackTrace: err.stack,
      });
      break;
    case constants.VALIDATION_ERROR:
      res.status(err.statusCode).json({
        title: "Validation Faild",
        message: err.message,
        timstamp: new Date(),
        stackTrace: err.stack,
      });
      break;
    case constants.UNAUTHORIZED:
      res.status(err.statusCode).json({
        title: "Unauthorized",
        message: err.message,
        timstamp: new Date(),
        stackTrace: err.stack,
      });
      break;
    case constants.FORBIDDEN:
      res.status(err.statusCode).json({
        title: "Forbidden",
        message: err.message,
        timstamp: new Date(),
        stackTrace: err.stack,
      });
      break;
    case constants.NOT_FOUND:
      res.status(err.statusCode).json({
        title: "Not Found",
        message: err.message,
        timstamp: new Date(),
        stackTrace: err.stack,
      });
      break;
    case constants.CONFLICT:
      res.status(err.statusCode).json({
        title: "Conflict",
        message: err.message,
        timstamp: new Date(),
        stackTrace: err.stack,
      });
      break;
    case constants.SERVER_ERROR:
      res.status(err.statusCode).json({
        title: "Server Error",
        message: err.message,
        timstamp: new Date(),
        stackTrace: err.stack,
      });
      break;

    default:
      res.json(err);
      break;
  }
};

module.exports = errorHandler;
