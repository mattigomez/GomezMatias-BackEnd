const {Router} = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.send('<h1>Bienvenido al chat</h1>')
});  

module .exports = router