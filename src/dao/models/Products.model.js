const mongoose = require('mongoose')

const collectionName = 'product'

const collectionSchema = new mongoose.Schema({
  title: String,
  code: {
      type: String,
      unique: true,
  },
  status: Boolean,
  measurement: String,
  thumbnails: String,
  stock: Number,
  price: Number,
  description: String,
  category: String
});

const Products = mongoose.model(collectionName, collectionSchema)

module.exports = Products
