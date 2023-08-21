const { Router } = require('express');
const passport = require('passport');
const logger = require('../utils/logger.util');


const router = Router();

router.post('/',passport.authenticate('register',{failureRedirect: 'register/failregister'}), async (req, res,next) => {
  try {
    const newUser = req.user
    logger.info('Se registro un nuevo usuario', newUser)

    res.status(201).json({ status: 'success', message: newUser });
    
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
