const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gomezmati1997@gmail.com',
      pass: 'uucmalirqwvgnkai',
    }
  })

class MailerRepository {
    
    sendMail(mailOptions){
        transporter.sendMail(mailOptions,(error,info) => {
            if (error) {
                console.log('Error al enviar el correo:',error);
            } else {
                console.log('Correo enviado con exito:',info.response);
            }
        })
    }
}

module.exports = MailerRepository