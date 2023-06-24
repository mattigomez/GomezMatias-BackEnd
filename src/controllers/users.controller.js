const { Router } = require('express');
const passport = require('passport');

const router = Router();

router.post('/',passport.authenticate('register',{failureRedirect: 'register/failregister'}), async (req, res) => {
  try {
    res.status(201).json({ status: 'success', message: 'Usuario registrado' });
    
  } catch (error) {
    console.log(error.message);
    next(error)
  }
});

router.get('/',(req,res) => {
  try {
    res.render('register.handlebars')
  } catch (error) {
    next(error)
    
  }
})

router.get('/failregister',(req,res) =>{
  console.log('fallo estrategia de registro');
  res.json({error: 'Failed register'})
})

module.exports = router;
