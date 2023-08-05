const {Router} = require('express')
const Users = require('../dao/models/Users.model')
const UserDTO = require('../DTO/users.dto')
const UserRepository = require('../repository/users.repository')
const ErrorRepository = require('../repository/errors.repository')
const logger = require('../utils/logger.util')
const multerUpload = require('../config/multer.config')
const path = require ('path')

const router = Router()

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
  
      const userRepository = new UserRepository()
      const changeRole = await userRepository.changeUserRole(user)
  
      logger.info('se cambio el role del usuario actual', changeRole)
      res.json({user: changeRole})
      
    } catch (error) {
      logger.error('Error al cambiar el role del usuario', error)
      next(error)
    }
  })
  
  router.post('/:uid/documents', multerUpload.any(), async (req, res, next) => {
    try {
      const userId = req.params.uid
      const user = await Users.findById(userId)
      const uploadedDocuments = req.files.map((file) => ({
        name: file.originalname,
        reference: file.filename,
      }))
      user.document.push(...uploadedDocuments)
      await user.save()
      res.json({ message: 'Document(s) uploaded successfully.' })
    } catch (error) {
      console.error('Error uploading document(s):', error)
      next(error)
    }
  })

module.exports = router