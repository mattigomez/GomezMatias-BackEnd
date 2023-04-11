const { Router } = require('express')
const Products = require('../dao/models/Products.model')

const router = Router()

router.get('/', async (req, res) => {
  try {
    const products = await Products.find()
    res.json({ message: products })
  } catch (error) {
    res.json({ error })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, lastName, email } = req.body
    const newProductInfo = {
      name,
      lastName,
      email,
    }

    const newProduct = await Products.create(newProductInfo)
    res.json({ message: newProduct })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Esta cuenta ya existe' })
    }

    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
