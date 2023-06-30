const { Router } = require('express');
const passport = require('passport');
const logger = require('../utils/logger.util')

const router = Router();

router.get('/', (req, res,next) => {
  try {
    res.render('login.handlebars')
  } catch (error) {
    next(error)
  }
})

router.post('/',passport.authenticate('login',{failureRedirect: '/api/login/faillogin'}),async (req, res,next) => {
  try {
    if(!req.user){
      const error = error
      return next(error)
    }

    // Establecer una session con los datos del usuario autenticado
    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
      cartId: req.user.cartId
    };
    
    logger.info('sesion iniciada' , req.session.user)
    res.status(200).json({ status: 'success', message: 'sesion iniciada' });
  } catch (error) {
    logger.error('Error al iniciar sesion', error)
    next(error)
  }
});

router.get('/github', passport.authenticate('github',{scope: ['user: email']}),async (req,res) =>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/api/login/faillogin'}),
    async(req,res) => {
      req.session.user = req.user
      res.redirect('/api/dbProducts?limit=9')
    })

router.get('/logout', (req,res) => {
    req.session.destroy(error => {
        if(error){
          logger.error('Error al cerrar sesion', error)
          return next(error)
        }
        res.redirect('/api/login')
    })
})

router.get('/faillogin',(req,res) =>{
  logger.error('Error al iniciar sesion')
  res.json({ status: 'error', message: 'El usuario y la contraseña no coinciden' })
})

module.exports = router;
