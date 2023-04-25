const { Router } = require ('express')
const Users = require('../dao/models/Users.model')


const router = Router()

router.post('/', async (req,res) => {
    try {
        const {email,password} = req.body
        
        const user = await Users.findOne({ email })
        console.log(user);
        if(!user) return res.status(400).json({status: 'error', error: 'El usuario y contraseña no coinciden'})
        
        if(user.password !== password)  return res.status(400).json({status: 'error', error: 'El usuario y contraseña no coinciden'}) 
        
        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        }

        res.json({status: 'success', message: 'sesion iniciada'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({status: 'error', message: 'Internal Server Error'})
    }
})

module.exports= router