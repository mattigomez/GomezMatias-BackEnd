const authController = require('../controllers/auth.controller')
const usersController = require('../controllers/users.controller')
const productsController = require('../controllers/products.controller')
const cartsController = require('../controllers/carts.controller')
const messagesController = require('../controllers/messages.controller')
const sessionController = require('../controllers/session.controller')
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
  app.use('/api/register', usersController)
  app.use('/api/dbProducts', productsController)
  app.use('/api/dbCarts', cartsController)
  app.use('/api/messages', messagesController)
  app.use('/api/sessions/current', sessionController)
  app.use(errorHandler)
}

module.exports = router
