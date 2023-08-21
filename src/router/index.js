const authController = require('../controllers/auth.controller')
const registerController = require('../controllers/register.controller')
const productsController = require('../controllers/products.controller')
const cartsController = require('../controllers/carts.controller')
const usersController = require ('../controllers/users.controller')
const messagesController = require('../controllers/messages.controller')
const loggerController = require('../controllers/logger.controller')
const adminUsers = require ('../controllers/adminUsers.controller')
const ErrorRepository = require('../repository/errors.repository')


const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorRepository) {
    const errorMessage = err.message || 'Error desconocido'
    res.status(err.code).json({ error: errorMessage });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
  }
};

const router = app => {
  app.use('/api/login', authController)
  app.use('/api/register', registerController)
  app.use('/api/dbProducts', productsController)
  app.use('/api/dbCarts', cartsController)
  app.use('/api/users', usersController)
  app.use('/api/adminUsers', adminUsers)
  app.use('/api/messages', messagesController)
  app.use('/api/loggerTest', loggerController )
  app.use(errorHandler)
}

module.exports = router
