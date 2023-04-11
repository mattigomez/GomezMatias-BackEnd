const Carts = require('./models/Carts.model')

class DbCartManager {
  constructor() {}

  async getCarts() {
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

  async addCart(newCartInfo) {
    try {
      return await Carts.create(newCartInfo)
    } catch (error) {
      return error
    }
  }

  async getCartById(id) {
    return await Carts.findById(id);
  }

async deleteCart(id) {
    return await Carts.deleteOne({ _id: id });
  }

async updateCart(id, product) {
  const cartToUpdate = await this.getCartById(id);
  if (cartToUpdate) {
      const productToUpdate = cartToUpdate.products.find(p => p.id == product.id);
      if (productToUpdate) {
          productToUpdate.quantity = productToUpdate.quantity + product.quantity;
      } else {
          cartToUpdate.products.push(product);
      }
      return await Carts.updateOne({ _id: id }, cartToUpdate);
    }
    return false;
}

  async deleteAll() {
    return await Carts.deleteMany()
  }
}

module.exports = DbCartManager
