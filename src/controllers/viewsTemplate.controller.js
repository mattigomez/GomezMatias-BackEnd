/* const {Router} = require('express');
const publicAccess = require('../middlewares/publicAccess.middleware');
const privateAccess = require('../middlewares/privateAccess.middleware');

const router = Router();

router.get('/signup', publicAccess , (req, res) => {
    res.render('signup.handlebars')
});  

router.get('/login', publicAccess , (req, res) => {
    res.render('login.handlebars')
}); 

router.get('/', privateAccess , (req, res) => {
    const {user} = req.session
    res.render('profile.handlebars',{ user })
});  

module .exports = router */