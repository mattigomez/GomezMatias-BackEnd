const viewsTemplateController = require('../viewsTemplate/controller.viewsTemplate')
const authController = require('../auth/controller.auth')
const usersController = require('../users/controller.users')
const productsController = require('../products/controller.products')
const cartsController = require('../carts/controller.carts')
const messagesController = require('../messages/controller.messages')


const router = app => {
  app.use('/', viewsTemplateController)
  app.use('/auth', authController)
  app.use('/users', usersController)
  app.use('/products', productsController)
  app.use('/carts', cartsController)
  app.use('/messages', messagesController)
}

module.exports = router
