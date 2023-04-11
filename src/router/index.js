const productsController = require('../products/controller.products')
const cartsController = require('../carts/controller.carts')

const router = app => {
  app.use('/products', productsController)
  app.use('/carts', cartsController)
}

module.exports = router
