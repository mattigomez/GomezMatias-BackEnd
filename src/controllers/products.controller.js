const { Router } = require('express')
const Products = require('../dao/models/Products.model')
const Cart = require('../dao/models/Carts.model')
const privateAccess = require('../middlewares/privateAccess.middleware')
const productSearch = require('../dao/products.dao')
const adminAccess = require('../middlewares/adminAccess.middleware')
const userAccess = require('../middlewares/userAccess.middleware')
const ProductsRepository = require ('../repository/products.repository')
const ErrorRepository = require('../repository/errors.repository')
const logger = require('../utils/logger.util')

const router = Router()

router.get('/', privateAccess, async (req, res, next) => {
  try {
    const user = req.session.user;
    const message = user ? `Bienvenido ${user.role} ${user.first_name} ${user.last_name}!`: null;

    const cart = await Cart.findOne({ _id: user.cartId });

    const cartId = cart._id.toString()
    const products = await productSearch(req, message, cartId)

    logger.info('Productos agregados con exito',products)
    res.render('products.handlebars', products);
  } catch (error) {
    logger.error('Error al agregar productos',error)
    next(error)
  }
});

//genera 100 productos con el mismo formato que los de la db
router.get('/mockingProducts',userAccess, async (req, res, next) => {
  try {
    const productsRepository = new ProductsRepository()
    const mockProducts = await productsRepository.generateMockProducts()

    res.json({Productos: mockProducts})
  } catch (error) {
    logger.error('Error al generar productos',error)
    next(error)
  }
})

router.post('/', adminAccess , async (req, res, next) => {
  try {
    if(req.session.user.role !== 'premium' && req.session.user.role !== 'administrador'){
    throw new ErrorRepository('Rol de usuario rechazado', 401)
    }
    if(req.body.owner === null){
      req.body.owner === 'administrador'
    }

    req.body.owner = req.session.user.email
    const newProduct = await Products.create(req.body)
    
    logger.info('Se agrego un producto a la db', newProduct)
    res.json({message: newProduct})

  } catch (error) {
    logger.error('Error al agregar producto', error)
    next(error)
  }
})

router.put('/:productId', adminAccess , async (req, res, next) => {
   try {
    const product = await Products.findById(req.params.productId)
    const user = req.session.user

    if (user.role === 'administrador' || (user.email !== 'premium' && product.owner !== 'premium')) {
      return new ErrorRepository('No tienes permiso para modificar este producto', 401)
    }
    const updatedProduct = await Products.findByIdAndUpdate(req.params.productId, req.body, { new: true })

    logger.info('Producto actualizado con exito', updatedProduct)
    res.json({ message: 'Product updated successfully', product: updatedProduct })

  } catch (error) {
    logger.error('Error al actualizar el producto')
    next(error)
  }
})

router.delete('/:productId', adminAccess , async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.productId)
    const user = req.session.user

    if (user.role === 'administrador' || (user.email !== 'premium' && product.owner !== 'premium')) {
      return new ErrorRepository('No tienes permiso para eliminar este producto', 401)
    }
    await Products.findByIdAndDelete(req.params.productId)

    logger.info('Producto eliminado', req.params.productId)
    res.json({message: `Producto ID ${req.params.productId} eliminado`})

  } catch (error) {
    logger.error('Error al eliminar el producto', error)
    next(error)
  }
})


module.exports = router