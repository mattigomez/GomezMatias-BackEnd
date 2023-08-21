const { Router } = require('express')
const mongoose = require('mongoose')
const Cart = require('../dao/models/Carts.model')
const Products = require('../dao/models/Products.model')
const userAccess = require('../middlewares/userAccess.middleware')
const cartsDao = require('../dao/carts.dao')
const ticketsDao = require('../dao/tickets.dao')
const uuid = require('uuid')
const ErrorRepository = require('../repository/errors.repository')
const logger = require('../utils/logger.util')

const router = Router()

router.post('/', userAccess , async (req, res,next) => {
  try {
    const newCart = await Cart.create({})
    logger.info('Nuevo carrito creado:', newCart)
    res.status(200).json(newCart)
  } catch (error) {
    logger.error('Error al crear un nuevo carrito', error)
    next(error)
  }
})

router.get('/:cid', userAccess , async (req, res,next) => {
  try {
      const cart = await Cart.findById(req.params.cid).populate('productos.product');
      res.status(200).render('carts.handlebars', {cart});
      logger.info('Carrito especifico: ',{cartId:req.params.cid})
    } catch (error) {
      logger.error('Error al obtener el carrito', error)
      next(new ErrorRepository('Error al mostrar el carrito', 400))
    }
  });


//agregar un producto en un carrito
router.post('/:cartId/:productId', userAccess , async (req, res,next) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cartId });
    const product = await Products.findOne({_id: req.params.productId});
    const user = req.session.user

    if(user.role === 'premium' && product.owner !== 'premium'){
      return new ErrorRepository('No tienes permisos para agregar productos',401)
    }

    await cartsDao.saveProduct(cart, product)
    
    logger.info('Producto agregado con exito')
    res.status(200).json('se agrego el producto con exito')

  } catch (error) {
    logger.error('Error al agregar producto al carrito', error)
    next(error)
  }
});


//actualizar el carrito 
router.put('/:cid', userAccess ,async (req, res,next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = req.body.productos;
    await cart.save();

    res.status(200).json({ message: 'Carrito actualizado con exito', cart });
    logger.info('Carrito actualizado!', cart)
  } catch (error) {
    logger.error('Error actualizando cart', error)
    next(error)
  }
});

// actualizar la cantidad de ejemplares del producto 
router.put('/:cid/products/:pid', userAccess ,async (req, res,next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const item = cart.productos.find(item => item.product == req.params.pid);

    if (!item) throw new Error('Producto no encontrado');
    item.quantity = req.body.quantity;
    await cart.save();

    res.status(200).json({ message: 'Carrito actualizado con exito', cart });
    logger.info('Cantidad de productos actualizada!', cart)
  } catch (error) {
    logger.error('Error actualizando cart', error)
    next(error)
  }
});

// eliminar del carrito el producto seleccionado
router.post('/:cid/products/:pid', async (req, res,next) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cid });
    const productIndex = cart.productos.findIndex(item => item.product.equals(new mongoose.Types.ObjectId(req.params.pid)));

    if (productIndex === -1) throw new Error('Producto no encontrado');
    cart.productos.splice(productIndex, 1);
    await cart.save();

    logger.info('Producto eliminado con exito!', cart)
    res.status(200).json('se elimino el producto')

  } catch (error) {
    logger.error('Error eliminando producto del cart', error)
    next(error)
  }
});

// eliminar todos los productos del carrito
router.delete('/:cid', async (req, res,next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = [];
    await cart.save();

    logger.info('Productos eliminados con exito!', cart)
    res.status(200).json({ message: 'Todos los productos fueron eliminados del cart', cart });
  } catch (error) {
    logger.error('Error eliminando todos los productos del cart', error)
    next(error)
  }
});


// Finalizar compra

router.get('/:cid/purchase', userAccess , async (req, res,next) => {
  try {
    const cartId = req.params.cid
    const cart = await Cart.findById(cartId)
    const userEmail = req.user.email
    const code = uuid.v4()

    const purchaseData = await ticketsDao.processDataTicket(code, userEmail, cart)
    const ticket = purchaseData.ticket
    const unprocessedProducts = purchaseData.unprocessedProducts

    if(unprocessedProducts.length > 0){
      res.json({"Productos sin stock suficiente": unprocessedProducts,
                "Ticket de compra": ticket})
    }else{
      res.json({"Gracias por su compra": ticket})
    }
    logger.info('Compra realizada con exito!', cart)
  } catch (error) {
    logger.error('Error al finalizar la compra', error)
    next(error)
  }
})

module.exports = router