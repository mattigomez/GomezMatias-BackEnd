const {Router} = require('express')

const router = Router();

router.get('/signup', (req, res) => {
    
    res.render('signup.handlebars')
});  

router.get('/login', (req, res) => {
    
    res.render('login.handlebars')
}); 

module .exports = router