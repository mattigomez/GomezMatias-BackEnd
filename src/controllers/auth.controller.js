const { Router } = require('express');
const passport = require('passport');

const router = Router();

router.get('/', (req, res) => {
  try {
    res.render('login.handlebars')
  } catch (error) {
    res.status(400).json({error: error})
  }
})

router.post('/',passport.authenticate('login',{failureRedirect: '/login/faillogin'}),async (req, res) => {
  try {
    if(!req.user) return res.status(401)
    .json({status:'error',error:'Usuario y contraseña no coinciden'})

    // Establecer una session con los datos del usuario autenticado
    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
      cartId: req.user.cartId
    };
    
    res.status(200).json({ status: 'success', message: 'sesion iniciada' });

    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

router.get('/github', passport.authenticate('github',{scope: ['user: email']}),async (req,res) =>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'login/faillogin'}),
    async(req,res) => {
      req.session.user = req.user
      res.redirect('/api/dbProducts?limit=9')
    })

router.get('/logout', (req,res) => {
    req.session.destroy(error => {
        if(error) return res.json({error})
        res.redirect('/api/login')
    })
})

router.get('/faillogin',(req,res) =>{
  console.log('El usuario y la contraseña no coinciden')
 
  res.json({ status: 'error', message: 'El usuario y la contraseña no coinciden' })
})

module.exports = router;
