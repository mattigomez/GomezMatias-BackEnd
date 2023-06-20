const {Router} = require('express')
const Message = require('../dao/models/Messages.model')
const userAcces = require('../middlewares/userAccess.middleware')

const router = Router()

router.get('/', userAcces, async (req, res) => {
  const messages = await Message.find().lean()
  const userEmail = req.user.email
  res.render('messages.handlebars', { messages, userEmail });
});

module.exports = router