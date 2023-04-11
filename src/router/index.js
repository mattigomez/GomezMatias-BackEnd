const homeController = require('../home/controller.home')
const productsController = require('../products/controller.products')
const cartsController = require('../carts/controller.carts')
const messagesController = require('../messages/controller.messages')

const router = app => {
  app.use('/', homeController)
  app.use('/products', productsController)
  app.use('/carts', cartsController)
  app.use('/messages', messagesController)
}

module.exports = router
