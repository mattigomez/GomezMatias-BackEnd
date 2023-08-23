const {Router} = require('express')
const Users = require('../dao/models/Users.model')
const UserDTO = require('../DTO/users.dto')
const ErrorRepository = require('../repository/errors.repository')
const userDao = require('../dao/users.dao')
const logger = require('../utils/logger.util')
const multerUpload = require('../config/multer.config')
const path = require ('path')
const mailerDao = require ('../dao/mailer.dao')
const adminAccess = require('../middlewares/adminAccess.middleware')

const router = Router()

router.get('/',async (req, res, next) =>{
  try {
    const users = await userDao.getUsers()
    
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
})

router.get('/session/current', (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      const userSession = req.session.user
      const UserDto = new UserDTO(userSession)
      return res.status(200).json(UserDto)
    }
      next(new ErrorRepository(404))
  } catch (error) {
    next(error)
  }
})


router.get('/premium/:uid', async (req, res, next) => {
    try {   
      const userId = req.params.uid
      const user = await Users.findById(userId)

      if(user.role === 'administrador'){
        throw new ErrorRepository('Error, role no autorizado', 401)
      }

      const requiredDocuments = ['product', 'profile', 'document'];
      const userDocuments = user.document.map((doc) => path.basename(doc.name, path.extname(doc.name)));
      const hasAllRequiredDocuments = requiredDocuments.every((doc) => userDocuments.includes(doc));
  
      if (!hasAllRequiredDocuments) {
        throw new Error('El usuario debe cargar los siguientes documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta');
      }

      const changeRole = await userDao.changeUserRole(user)
  
      logger.info('se cambio el role del usuario actual', changeRole)
      res.json({user: changeRole})
      
    } catch (error) {
      logger.error('Error al cambiar el role del usuario', error)
      next(error)
    }
  })
  
  router.post('/:uid/documents', multerUpload.any() , async (req, res, next) => {
    try {
      const userId = req.params.uid
      const user = await Users.findById(userId)
      const uploadedDocuments = req.files.map((file) => ({
        name: file.originalname,
        reference: file.filename,
      }))
      user.document.push(...uploadedDocuments)
      await user.save()
      res.json({ message: 'Documents uploaded successfully.' })
    } catch (error) {
      console.error('Error uploading documents:', error)
      next(error)
    }
  })
 

  // eliminar usuarios inactivos

  router.delete('/', adminAccess ,async (req, res, next) => {
    try {

    // timeInactive = 1dia
    const timeInactive = 86400000 
    const time = new Date()
     // Encuentra los usuarios inactivos que no se han conectado en el ultimo día
    const users = await Users.find({last_connection:{ $lt: new Date(time - timeInactive)}})

    for (const user of users) {
      // Enviar correo al usuario
      const mailOptions = {
        from: 'Administrador del ecommerce',
        to: user.email,
        subject: 'Cuenta inactiva',
        text: 'Cuenta eliminada debido a su inactividad.'
      }
      await mailerDao.sendMail(mailOptions)
      // Eliminar cuenta de usuario
      await Users.deleteOne(user);
    }
    res.status(201).json({ message: 'Cuentas eliminadas por inactividad' });
  } catch (error) {
    next(error);
  }
})

router.get('/deleteUser/:uid',adminAccess, async (req, res, next) => {
  try {
    const userId = req.params.uid
    const user = await Users.findOne({_id: userId})
    await Users.deleteOne({_id: userId})

    res.status(201).json({message: `Usuario ${user.email} eliminado`})
  } catch (error) {
    next(error)
  }
})

router.get('/changeRole/:uid',adminAccess,  async (req, res, next) => {
  try {
    const userId = req.params.uid
    const user = await Users.findById(userId)

    if(user.role === 'administrador'){
      throw new ErrorRepository('Error, usuario no autorizado', 401)
    }
    const changeRole = await userDao.changeUserRole(user)
    res.status(200).json({user: changeRole})
  } catch (error) {
    next(error)
  }
})

module.exports = router