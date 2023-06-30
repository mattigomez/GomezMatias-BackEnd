const { Router } = require('express')
const mongoose = require('mongoose')
const Cart = require('../dao/models/Carts.model')
const Products = require('../dao/models/Products.model')
const userAcces = require('../middlewares/userAccess.middleware')
const saveProductInCar = require('../dao/carts.dao')
const checkDataTicket = require('../dao/tickets.dao')
const uuid = require('uuid')
const ErrorRepository = require('../repository/errors.repository')
const logger = require('../utils/logger.util')


const router = Router()

//POST crea un carrito vacio
router.post('/', async (req, res,next) => {
  try {
    const newCart = await Cart.create({})
    console.log('Nuevo carrito creado:', newCart)
    res.status(201).json(newCart)
  } catch (error) {
    logger.error('Error al crear un nuevo carrito', error)
    next(error)
  }
})

// GET muestra un carrito en especifico
router.get('/:cid', userAcces, async (req, res,next) => {
  try {
      const cart = await Cart.findById(req.params.cid).populate('productos.product');
      res.status(200).render('carts.handlebars', {cart});
    } catch (error) {
      logger.error('Error al obtener el carrito', error)
      next(new ErrorRepository('Error al mostrar el carrito', 400))
    }
  });


//POST introduce un producto en un carrito
router.post('/:cartId/:productId',userAcces , async (req, res,next) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cartId });
    const product = await Products.findOne({_id: req.params.productId});
    
    await saveProductInCar(cart, product)

    logger.info('Producto agregado con exito')
    res.status(200).redirect(req.header('Referer'))
  } catch (error) {
    logger.error('Error al agregar producto al carrito', error)
    next(error)
  }
});


// PUT actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res,next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = req.body.productos;
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    logger.error('Error actualizando cart', error)
    next(error)
  }
});

// PUT actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad
router.put('/:cid/products/:pid', async (req, res,next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const item = cart.productos.find(item => item.product == req.params.pid);
    if (!item) throw new Error('Product not found in cart');
    item.quantity = req.body.quantity;
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    logger.error('Error actualizando cart', error)
    next(error)
  }
});

// DELETE del carrito el producto seleccionado
router.post('/:cid/products/:pid', async (req, res,next) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cid });
    const productIndex = cart.productos.findIndex(item => item.product.equals(new mongoose.Types.ObjectId(req.params.pid)));
    if (productIndex === -1) throw new Error('Product not found in cart');
    cart.productos.splice(productIndex, 1);
    await cart.save();
    res.redirect(`/api/dbCarts/${req.params
    .cid}`)
  } catch (error) {
    logger.error('Error eliminando producto del cart', error)
    next(error)
  }
});

// DELETE todos los productos del carrito
router.delete('/:cid', async (req, res,next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = [];
    await cart.save();
    res.json({ message: 'All products removed from cart', cart });
  } catch (error) {
    logger.error('Error eliminando todos los productos del cart', error)
    next(error)
  }
});


// Finalizar compra

router.get('/:cid/purchase',userAcces , async (req, res,next) => {
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
    logger.error('Error al finalizar la compra', error)
    next(error)
  }
})

module.exports = router