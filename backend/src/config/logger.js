const winston = require('winston');

const levels = {
  error: 0, // Most critical
  warn: 1,
  info: 2,
  http: 3, // For HTTP requests/responses
  debug: 4, // Least critical, for detailed debugging
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn'; 
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define where to output logs (transports)
const transports = [
  // Always log to the console
  new winston.transports.Console(),

  // Optionally, log errors to a separate file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error', // Only log errors to this file
    format: winston.format.combine( 
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.json() // Log as JSON in files for easier parsing
    )
  }),

 
];

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false, // Do not exit on handled exceptions
});

// stream object for Morgan 
logger.stream = {
    write: (message) => {
        logger.http(message.substring(0, message.lastIndexOf('\n'))); 
    },
};


module.exports = logger; 