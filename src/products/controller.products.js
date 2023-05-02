const { Router } = require('express')
const DbProductManager = require('../dao/dbProductManager')
const uploader = require('../utils/multer.utils')


const router = Router()

const Products = new DbProductManager()

router.get('/', async (req, res) => {
  const limit = req.query.limit
  try {
    const products = await Products.getProducts(limit)
    res.status(200).json({ message: products })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
      const product = await Products.getProductById(pid);
      if (product) {
          res.status(200).json(product);
      } else {
          res.status(404).json({ error: 'Producto no encontrado' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/', uploader.single('file'), async (req, res) => {
  try {
      const { title, code, status, measurement, stock, price, description, category } = req.body;
      const productInfo = {
          title,
          code,
          status,
          measurement,
          thumbnails: req.file.filename,
          stock,
          price,
          description, category
      };
      const newProduct = await Products.addProduct(productInfo);
      res.status(200).json({ message: newProduct });
  } catch (error) {
      if (error.code === '11000') {
          res.status(400).json({ message: 'El producto que quieres ingresar ya existe.' });
      } else {
          console.error(error);
          res.status(500).json({ error: 'Internal server error.' });
      }

  }
})

router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
      const product = await Products.getProductById(pid);
      if (product) {
          const { title, measurement, thumbnails, stock, price, description, category } = req.body;
          const productInfo = {
              title,
              measurement,
              thumbnails,
              stock,
              price,
              description,
              category
          };
          const result = await Products.updateProduct(pid, productInfo);
          if (result) {
              res.status(200).json({ message: 'Producto actualizado satisfactoriamente' });
          }
          else {
              res.status(500).json({ error: 'Internal server error' });
          }
      } else {
          res.status(404).json({ error: 'Producto no encontrado' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error.' });
  }
})

router.delete('/:cid', async (req, res) => {
  const { cid: pid } = req.params;
  const productToDel = await Products.getProductById(pid);
  if (productToDel) {
      const result = await Products.deleteProduct(pid);
      if (result) {
          res.status(200).json({ message: 'Producto eliminado satisfactoriamente!!!' });
      } else {
          res.status(500).json({ error: 'Internal server error' });
      }
  } else {
      res.status(404).json({ message: 'Producto no encontrado' });
  }
});

module.exports = router
