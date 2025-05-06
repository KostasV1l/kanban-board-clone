const logger = require('../config/logger');

const handleDevelopmentError = (err, res) => {
    logger.error(err)

    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const handleProductionError = (err, res) => {
    if (err.isOperational) {
        logger.warn(`Operational error: ${err.statusCode} - ${err.message}`)
        res.status(err.statusCode || 500).json({
            status: 'fail',
            message: err.message,
        })
    } else {
        logger.error('Programming Error: ', err)
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    }
}


const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'; 
  
    if (process.env.NODE_ENV === 'development') {
      handleDevelopmentError(err, res);
    } else if (process.env.NODE_ENV === 'production') {
       handleProductionError(err, res);
    } else {
         logger.error('Unknown Environment Error:', err);
         res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred.',
         });
    }
  };

module.exports = globalErrorHandler;

