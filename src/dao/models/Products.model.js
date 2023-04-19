const mongoose = require('mongoose')
const moongosePaginate = require('mongoose-paginate-v2')

const collectionName = 'product'

const collectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: {
      type: String,
      unique: true,
  },
  price: Number,
  status: Boolean,
  measurement: String,
  stock: Number,
  category: String,
  thumbnails: String
});

collectionSchema.plugin(moongosePaginate)

const Products = mongoose.model(collectionName, collectionSchema)

module.exports = Products
