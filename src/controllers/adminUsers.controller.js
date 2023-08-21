const { Router } = require('express')
const adminAccess = require('../middlewares/adminAccess.middleware')
const Users = require ('../dao/models/Users.model')

const router = Router()

router.get('/',adminAccess,async (req,res,next) =>{
    try {
        const users = await Users.find()
        res.render('adminUsers.handlebars',{users})
    } catch (error) {
        next(error)
    }
})

module.exports = router