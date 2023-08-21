const CartsRepository = require('../repository/carts.repository')

const cartsDao = new CartsRepository()

module.exports = cartsDao

/* async function saveProductInCar(cart, product) {
  try {
    const cartsRepository = new CartsRepository()
    return cartsRepository.saveProduct(cart, product)
  } catch (error) {
    return error
  }
} */

