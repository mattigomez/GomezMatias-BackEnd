const mongoose = require('mongoose')

const collectionName = 'product'

const collectionSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
})

const Products = mongoose.model(collectionName, collectionSchema)

module.exports = Products
