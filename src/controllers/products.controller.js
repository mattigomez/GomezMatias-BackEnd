const { Router } = require('express')
const Products = require('../dao/models/Products.model')
const Cart = require('../dao/models/Carts.model')
const privateAccess = require('../middlewares/privateAccess.middleware')
const productSearch = require('../dao/products.dao')
const adminAccess = require('../middlewares/adminAccess.middleware')
const userAcces = require('../middlewares/userAccess.middleware')
const ProductsRepository = require ('../repository/products.repository')

const router = Router()

// Utiliza el middleware de acceso privado para verificar que el usuaio este autenticado si no lo redirecciona al login
router.get('/', privateAccess, async (req, res, next) => {
  try {
    // Verificar si hay un usuario autenticado y pasar sus datos a la vista
    const user = req.session.user;
    const message = user
      ? `Bienvenido ${user.role} ${user.first_name} ${user.last_name}!`
      : null;
    // Buscar el carrito del usuario por el id del usuario
    const cart = await Cart.findOne({ _id: user.cartId });
    // parsear el objeto con el id del usuario a cadena
    const cartId = cart._id.toString()
    const products = await productSearch(req, message, cartId)
    //renderizamos la vista handlebars y pasamos los datos con los que trabajaremos
    res.render('products.handlebars', products);
  } catch (error) {
    next(error)
  }
});

//genera 100 productos con el mismo formato que los de la db
router.get('/mockingProducts',userAcces, async (req, res, next) => {
  try {
    const productsRepository = new ProductsRepository()
    const mockProducts = await productsRepository.generateMockProducts()
    res.json({Productos: mockProducts})
  } catch (error) {
    next(error)
  }
})

//Agregar un nuevo producto a la db
router.post('/', adminAccess , async (req, res, next) => {
  try {
    const newProduct = await Products.create(req.body)
    res.json({message: newProduct})
  } catch (error) {
    next(error)
  }
})

router.put('/:productId', adminAccess , async (req, res, next) => {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(req.params.productId, req.body, { new: true })
    res.json({ message: 'Product updated successfully', product: updatedProduct })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.delete('/:productId', adminAccess , async (req, res, next) => {
  try {
    await Products.findByIdAndDelete(req.params.productId)
    res.json({message: `Product with ID ${req.params.productId} has been deleted`})
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = router