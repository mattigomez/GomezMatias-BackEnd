const mongoose = require('mongoose')

const collectionName = 'cart'

const collectionSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  year: Number,
  image: String,
})

const Carts = mongoose.model(collectionName, collectionSchema)

module.exports = Carts
