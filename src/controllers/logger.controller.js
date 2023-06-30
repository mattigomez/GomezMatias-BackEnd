const {Router} = require('express')
const logger = require('../utils/logger.util')

const router = Router()
router.get('/', (req, res) => {
  logger.info('Testing - Info')
  logger.warning('Testing - Warning')
  logger.debug('Testing - Debug')
  logger.error('Testing - Error')

  res.send('Test logs ha funcionado')
})

module.exports = router