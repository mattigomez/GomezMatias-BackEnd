const {Router} = require('express')
const Message = require('../dao/models/Messages.model')
const userAccess = require('../middlewares/userAccess.middleware')

const router = Router()

router.get('/', userAccess , async (req, res, next) => {
  try {
    const messages = await Message.find().lean()
    const userEmail = req.user.email
    res.render('messages.handlebars', { messages, userEmail });
  } catch (error) {
    console.error(error)
    next(error)
  }
});

module.exports = router