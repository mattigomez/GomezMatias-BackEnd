require('dotenv').config({ path: '../.env'})

module.exports = {
  port: process.env.PORT || 3000,
}
