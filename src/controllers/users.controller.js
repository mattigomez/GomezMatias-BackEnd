const { Router } = require('express');
const passport = require('passport');
const UserRepository = require('../repository/users.repository')
const ErrorRepository = require('../repository/errors.repository');
const logger = require('../utils/logger.util');


const router = Router();

router.post('/',passport.authenticate('register',{failureRedirect: 'register/failregister'}), async (req, res,next) => {
  try {
    const newUser = req.user
    logger.info('Se registro un nuevo usuario', newUser)

    res.status(201).json({ status: 'success', message: 'Usuario registrado' });
    
  } catch (error) {
    logger.error('Error al crear usuario', error)
    next(error)
  }
});

router.get('/',(req,res,next) => {
  try {
    res.render('register.handlebars')
  } catch (error) {
    next(error)
    
  }
})

router.get('/failregister',(req,res) =>{
  logger.error('El mail no esta disponible')
  res.json({error: 'Failed register'})
})

router.get('/premium', async (req, res, next) => {
  try {
    const user = req.session.user
    if(user.role === 'administrador'){
      throw new ErrorRepository('Error, role no autorizado', 401)
    }

    const userRepository = new UserRepository()
    const changeRole = await userRepository.changeUserRole(user)
    
    logger.info('se cambio el role del usuario actual', changeRole)
    res.json({user: changeRole})
    
  } catch (error) {
    logger.error('Error al cambiar el role del usuario', error)
    next(error)
  }
})

module.exports = router;
