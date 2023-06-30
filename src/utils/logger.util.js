const winston = require ('winston')
const { dev_env } = require('../config/app.config')

const productionLogger = winston.createLogger({
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error'
    })
  ]
});

const developmentLogger = winston.createLogger({
    levels: {
      debug: 0,
      http: 1,
      info: 2,
      warning: 3,
      error: 4,
      fatal: 5
    },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        level: 'debug'
      })
    ]
  });
  
  let logger
if (dev_env === 'production') {
  logger = productionLogger
} else {
  logger = developmentLogger
}
  module.exports = logger;