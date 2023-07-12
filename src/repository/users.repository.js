const bcrypt = require('bcrypt')
const Users = require('../dao/models/Users.model')
const Cart = require('../dao/models/Carts.model')
const { admin_email, admin_password } = require('../config/admin.config')
const ErrorRepository = require('../repository/errors.repository')
const nodemailer = require ('nodemailer')
const logger = require('../utils/logger.util')

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
      return user
    } catch (error) {
      logger.error('Error al crear el usuario, verifica tus datos.', error)
      throw new ErrorRepository('Error al crear el usuario', 500)
    }}

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
      }
    }
  
    async sendPasswordResetEmail(email){
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'gomezmati1997@gmail.com',
          pass: 'uucmalirqwvgnkai',
        }
      });
      const resetLink = `http://localhost:3000/api/login/forgot-password/${email}`;
      const mailOptions = {
        from: 'gomezmati1997@gmail.com',
        to: email,
        subject: 'Restablecimiento de contraseña',
        text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink}`,
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo electrónico:', error);
        } else {
          console.log('Correo electrónico enviado:', info.response);
        }
      });
    }
}

module.exports = UserRepository