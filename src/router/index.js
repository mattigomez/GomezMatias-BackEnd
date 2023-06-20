const viewsTemplateController = require('../controllers/viewsTemplate.controller')
const authController = require('../controllers/auth.controller')
const usersController = require('../controllers/users.controller')
const productsController = require('../controllers/products.controller')
const cartsController = require('../controllers/carts.controller')
const messagesController = require('../controllers/messages.controller')
const sessionController = require('../controllers/session.controller')

const router = app => {
  /* app.use('/', viewsTemplateController) */
  app.use('/api/login', authController)
  app.use('/api/register', usersController)
  app.use('/api/dbProducts', productsController)
  app.use('/api/dbCarts', cartsController)
  app.use('/api/messages', messagesController)
  app.use('/api/sessions/current', sessionController)
}

module.exports = router
