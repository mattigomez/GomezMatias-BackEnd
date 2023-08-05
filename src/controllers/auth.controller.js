const { Router } = require('express');
const passport = require('passport');
const logger = require('../utils/logger.util');
const Users = require('../dao/models/Users.model')
const ErrorRepository = require('../repository/errors.repository')
const ResetPasswordRepository = require ('../repository/resetPassword.repository')

const router = Router();

router.get('/', (req, res,next) => {
  try {
    res.render('login.handlebars')
  } catch (error) {
    next(error)
  }
})

router.get('/forgot-password', (req, res, next) => {
  try {
    res.render('forgotPassword.handlebars')
  } catch (error) {
    next(error)
  }
})

router.get('/forgot-password/:email', (req, res, next) => {
  try {
    const email = req.params.email
    res.render('resetPassword.handlebars', {email})
  } catch (error) {
    next(error)
  }
})

router.post('/forgot-password',async (req, res, next) => {
  try {
    const email = req.body.email
    const session = await Users.findOne({email: email})

    if (!session){
      throw new ErrorRepository('Usuario no encontrado', 404)
    }
    const resetPasswordRepository = new ResetPasswordRepository()
    const createToken = await resetPasswordRepository.createToken(email, res)

    res.json({message: 'token enviado',token: createToken})
  } catch (error) {
    next(error)
  }
})

router.post('/reset-password/:email', async (req, res, next) => {
  const newPassword = req.body.newPassword
  const token = req.cookies.resetToken
  const email = req.params.email
  
  try {
    const resetPasswordRepository = new ResetPasswordRepository()
    await resetPasswordRepository.resetPassword(newPassword, token, email)

    res.status(200).json({message: 'Contraseña cambiada con exito'})
  } catch (error) {
    next(error)
  }})

router.post('/',passport.authenticate('login',{failureRedirect: '/api/login/faillogin'}),async (req, res,next) => {
  try {
    // El req.user viene del passport, en caso de no existir el usuario devolvemos error
    if(!req.user){
      const error = error
      return next(error)
    }

    // Establecer una session a partir del usuario autenticado
    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
      cartId: req.user.cartId
    };

    await Users.findByIdAndUpdate(req.user._id, {last_connection:true})
    
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
      await Users.findByIdAndUpdate(req.user._id, {last_connection:true})
      res.redirect('/api/dbProducts?limit=9')
    })

router.get('/logout',async (req,res) => {
    /* await Users.findByIdAndUpdate(req.user._id, {last_connection:false}) */

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
