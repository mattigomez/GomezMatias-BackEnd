const Carts = require('./models/Carts.model')

class CartsDao {
  constructor() {}

  async findAll() {
    try {
      return await Carts.find()
    } catch (error) {
      return error
    }
  }

  async insertMany(newCartInfo) {
    try {
      return await Carts.insertMany(newCartInfo)
    } catch (error) {
      return error
    }
  }

  async create(newCartInfo) {
    try {
      return await Carts.create(newCartInfo)
    } catch (error) {
      return
    }
  }

  async deleteAll() {
    return await Carts.deleteMany()
  }
}

module.exports = CartsDao
