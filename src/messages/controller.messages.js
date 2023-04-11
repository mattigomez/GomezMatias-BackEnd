const {Router} = require('express');
const DbMessageManager = require('../dao/dbMessageManager');

const router = Router();
const Messages = new DbMessageManager();

const title = 'Chat';
router.get('/', (req, res) => {
    res.render('chat.handlebars', {title});
}); 

router.delete('/', async (req, res) => {
    const result = await Messages.deleteMessages();
    if (result){
        res.status(200).json({ message: 'Mensajes eliminados satisfactoriamente!!!' });
    } else {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module .exports = router