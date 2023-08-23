const bcrypt = require('bcrypt')
const Users = require('../dao/models/Users.model')
const Cart = require('../dao/models/Carts.model')
const { admin_email, admin_password } = require('../config/admin.config')
const ErrorRepository = require('../repository/errors.repository')
const logger = require('../utils/logger.util')
const UserDTO = require ('../DTO/users.dto')

class UserRepository {

  async createUser(userInfo) {
    try {
      const {first_name,last_name,email,age,password} = userInfo

       if(!userInfo){
        console.log('faltan datos');
        throw new ErrorRepository('Datos incorrectos, verifica que los campos no esten vacios!', 400)
      }

      let role = 'usuario'

      const passwordMatch = bcrypt.compare(password, admin_password)
  
      if (email === admin_email && passwordMatch) {
        role = 'administrador';
      }

      const cart = new Cart()
      await cart.save()
      const cartId = cart._id
      
      const newUserInfo = {
        first_name,
        last_name,
        email,
        age,
        password,
        role,
        cartId,
      }

      const user = await Users.create(newUserInfo)
      logger.info('Usuario creado con exito', user)
      return user
    } catch (error) {
      logger.error('Error al crear el usuario, verifica tus datos.', error)
      throw new ErrorRepository('Error al crear el usuario', 500)
    }}


    async getUsers(){
      try {
        const users = await Users.find()
        const usersDTO = users.map(user => new UserDTO(user))
        return usersDTO
      
    } catch (error) {
      throw new ErrorRepository('Error al cargar usuarios')
    }}

    async deleteInactiveUsers(){
      try{
      // timeInactive = 15 min
      const timeInactive = 900000
      const time = new Date()
       // Encuentra los usuarios inactivos que no se han conectado en los últimos 2 días
      const users = await Users.find({last_connection:{ $lt: new Date(time - timeInactive)}})
      for (const user of users) {
        try {
          const lastConnectionTime = user.last_connection
          const timeDifference = currentTime - lastConnectionTime
  
          if (timeDifference >= twoDaysInMilliseconds) {
            // Enviar el correo electrónico
            await this.sendInactiveUserEmail(user.email)
  
            // Eliminar la cuenta
            await Users.findByIdAndDelete(user._id)
  
            logger.info(`Cuenta del usuario ${user.email} eliminada por inactividad.`)
          }
        } catch (emailError) {
          logger.error(`Error al enviar el correo al usuario ${user.email}:`, emailError)
        } 
      }
    } catch (error) {
      logger.error('Error al eliminar usuarios inactivos:', error)
      throw new ErrorRepository('Error al eliminar usuarios inactivos', 500)
    }
  }
  
    async changeUserRole(user){
      try {
        const usuario = await Users.findOne({_id: user._id})
        if(usuario.role === 'usuario'){
          usuario.role = 'premium'
        }else{
          usuario.role = 'usuario'
        }
        await usuario.updateOne({role: usuario.role})
      
        return usuario
      } catch (error) {
        logger.error('Error al cambiar el role del usuario', error)
        throw new ErrorRepository('Error al cambiar el rol', 500)
      }}
    }
module.exports = UserRepository