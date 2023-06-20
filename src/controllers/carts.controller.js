const { Router } = require('express')
const mongoose = require('mongoose')
const Cart = require('../dao/models/Carts.model')
const Products = require('../dao/models/Products.model')
const userAcces = require('../middlewares/userAccess.middleware')
const saveProductInCar = require('../dao/carts.dao')
const checkDataTicket = require('../dao/tickets.dao')
const uuid = require('uuid')

const router = Router()

//POST crea un carrito vacio
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({})
    console.log('Nuevo carrito creado:', newCart)
    res.status(201).json(newCart)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear un nuevo carrito' })
  }
})

// GET muestra un carrito en especifico
router.get('/:cid', userAcces, async (req, res) => {
  try {
      const cart = await Cart.findById(req.params.cid).populate('productos.product');
      res.status(200).render('carts.handlebars', {cart});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  });


//POST introduce un producto en un carrito
router.post('/:cartId/:productId',userAcces , async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cartId });
    const product = await Products.findOne({_id: req.params.productId});
    
    await saveProductInCar(cart, product)
    res.status(200).redirect(req.header('Referer'))
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});


// PUT actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = req.body.productos;
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error updating cart' });
  }
});

// PUT actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const item = cart.productos.find(item => item.product == req.params.pid);
    if (!item) throw new Error('Product not found in cart');
    item.quantity = req.body.quantity;
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error updating cart' });
  }
});

// DELETE del carrito el producto seleccionado
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cid });
    const productIndex = cart.productos.findIndex(item => item.product.equals(new mongoose.Types.ObjectId(req.params.pid)));
    if (productIndex === -1) throw new Error('Product not found in cart');
    cart.productos.splice(productIndex, 1);
    await cart.save();
    res.redirect(`/api/dbCarts/${req.params
    .cid}`)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error removing product from cart' });
  }
});

// DELETE todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = [];
    await cart.save();
    res.json({ message: 'All products removed from cart', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error removing products from cart' });
  }
});


// Finalizar compra

router.get('/:cid/purchase',userAcces , async (req, res) => {
  try {
    const cartId = req.params.cid
    const cart = await Cart.findById(cartId)
    const userEmail = req.user.email
    const code = uuid.v4()

    const purchaseData = await checkDataTicket(code, userEmail, cart)
    console.log(purchaseData)

    const ticket = purchaseData.ticket
    const unprocessedProducts = purchaseData.unprocessedProducts

    if(unprocessedProducts.length > 0){
      res.json({"Productos sin stock suficiente no procesados": unprocessedProducts,
                "Ticket de compra de los productos que si fueron procesados": ticket})
    }else{
      res.json({"Gracias por tu compra": ticket})
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al finalizar la compra' });
  }
})

module.exports = router