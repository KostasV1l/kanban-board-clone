const logger = require("../config/logger");

const handleDevelopmentError = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message,
    error: err,
  });
};

const handleProductionError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: "fail",
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    handleDevelopmentError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    handleProductionError(err, res);
  } else {
    logger.error("Unknown Environment Error:", err);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
    });
  }
  logger.error(err);
};

module.exports = globalErrorHandler;
