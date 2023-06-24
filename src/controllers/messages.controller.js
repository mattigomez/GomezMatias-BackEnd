const {Router} = require('express')
const Message = require('../dao/models/Messages.model')
const userAcces = require('../middlewares/userAccess.middleware')

const router = Router()

router.get('/', userAcces, async (req, res, next) => {
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