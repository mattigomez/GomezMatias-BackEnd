const { Router } = require('express')
const DbCartManager = require('../dao/dbCartManager')
const uploader = require('../utils/multer.utils')

const router = Router()
const Carts = new DbCartManager()

router.get('/', async (req, res) => {
  try {
    const carts = await Carts.getCarts()
    res.status(200).json({ message: carts })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/', uploader.single('file'), async (req, res) => {
  try {
    const idCart = await Carts.addCart();
    if (idCart) {
        res.status(200).json({ idCart });
    } else {
        res.status(500).json({ error: 'Internal server error' });
    };
      } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const cart = await Carts.getCartById(cid);
      if (cart) {
          res.status(200).json(cart.products);
      } else {
          res.status(404).json({ error: 'Carrito no encontrado' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const cart = Carts.getCartById(cid);
      if (cart) {
          obj = req.body;
          const product = {
              id: pid,
              quantity: obj.quantity
          }
          const result = await Carts.updateCart(cid, product);
          if (result) {
              res.status(200).json({ message: 'Producto agregado al carrito satisfactoriametne' });
          } else {
              res.status(500).json({ error: 'Carrito no encontrado' });
          }
      } else {
          res.status(404).json({ message: 'Carrito no encontrado' });
      };
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const cartToDel = Carts.getCartById(cid);
      if (cartToDel) {
          const result = await Carts.deleteCart(cid);
          if (result) {
              res.status(200).json({ message: 'Carrito eliminado satisfactoriamente!!!' });
          } else {
              res.status(500).json({ error: 'Internal server error' });
          }
      } else {
          res.status(404).json({ message: 'Carrito no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  };
})

module.exports = router
