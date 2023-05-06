const { Router } = require('express');
const passport = require('passport');

const router = Router();

router.post('/',passport.authenticate('login',{failureRedirect: '/auth/faillogin'}),async (req, res) => {
  try {
    if(!req.user) return res.status(401)
    .json({status:'error',error:'Usuario y contraseña no coinciden'})

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
    };
    
    res.json({ status: 'success', message: 'sesion iniciada' });

    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

router.get('/github', passport.authenticate('github',{scope: ['user: email']}),async (req,res) =>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}),
    async(req,res) => {
      req.session.user = req.user
      res.redirect('/')
    })

router.get('/logout', (req,res) => {
    req.session.destroy(error => {
        if(error) return res.json({error})
        res.redirect('/')
    })
})

router.get('/faillogin',(req,res) =>{
  console.log('El usuario y la contraseña no coinciden')
 
  res.json({ status: 'error', message: 'El usuario y la contraseña no coinciden' })
})

module.exports = router;
