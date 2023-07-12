const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const ErrorRepository = require('./errors.repository')
const logger = require('../utils/logger.util')
const Users = require('../dao/models/Users.model')
const {secret_key} = require('../config/app.config')

class ResetPasswordRepository {
  async sendPasswordResetEmail(email){
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gomezmati1997@gmail.com',
        pass: 'uucmalirqwvgnkai',
      }
    });
    const resetLink = `http://localhost:3000/api/login/forgot-password/${email}`;
  
    // Configura el correo electrónico
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

  async createToken(email, res){
  try {
    const token = jwt.sign({ email }, secret_key, { expiresIn: '1h' })
    
    await this.sendPasswordResetEmail(email)

    res.cookie('resetToken', token, { maxAge: 3600000, httpOnly: true })

    logger.info('Token generado con exito', token)
  } catch (error) {
    throw error
  }
  }

  async resetPassword(newPassword, token, email){
    try {
      const decodecToken = jwt.verify(token, secret_key)
      if(decodecToken.email !== email){
        return new ErrorRepository('El usuario no coincide con el email de solicitud.', 401)
      }
      const user = await Users.findOne({email: email})

      const passwordMatch = bcrypt.compareSync(newPassword, user.password)
  
      if (passwordMatch) {
        alert('La contraseña debe ser diferente a la anterior')
        return res.status(401).json({ error: 'La nueva contraseña debe ser diferente a la anterior' })
      }
  
      const hashedPass = await bcrypt.hash(newPassword, 10)
  
  
      // Actualiza la contraseña en la base de datos
      user.password = hashedPass
      await user.save()

      logger.info('Contraseña actualizada con exito')
    } catch (error) {
      throw new ErrorRepository('Error al actualizar la contraseña', 500)
    }
  }


}

module.exports = ResetPasswordRepository