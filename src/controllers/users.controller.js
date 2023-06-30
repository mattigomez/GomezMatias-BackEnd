const { Router } = require('express');
const passport = require('passport');
const ErrorRepository = require('../repository/errors.repository');
const logger = require('../utils/logger.util');


const router = Router();

router.post('/',passport.authenticate('register',{failureRedirect: 'register/failregister'}), async (req, res,next) => {
  try {
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

module.exports = router;
