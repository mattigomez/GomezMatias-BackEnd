const fs = require('fs')
const { Router } = require('express')
const uploader = require('../utils/multer.utils')
const FileManager = require('../dao/FileManager.dao')
const CartsDao = require('../dao/Carts.dao')

const router = Router()
const fileManager = new FileManager()
const Carts = new CartsDao()

router.get('/loadItems', async (req, res) => {
  try {
    const carts = await fileManager.loadItems()

    const newCarts = await Carts.insertMany(carts)

    res.json({ message: newCarts })
  } catch (error) {
    res.json({ error })
  }
})

router.get('/', async (req, res) => {
  try {
    const carts = await Carts.findAll()
    res.json({ message: carts })
  } catch (error) {
    res.json({ error })
  }
})

router.post('/', uploader.single('file'), async (req, res) => {
  try {
    const { title, author, description, year } = req.body
    const newCartInfo = {
      title,
      author,
      description,
      year,
      image: req.file.filename,
    }

    const newCart = await Books.create(newCartInfo)
    res.json({ message: newCart })
  } catch (error) {
    res.json({ error })
  }
})

router.delete('/deleteAll', async (req, res) => {
  await Carts.deleteAll()
  res.json({ message: 'Delete all' })
})

module.exports = router
