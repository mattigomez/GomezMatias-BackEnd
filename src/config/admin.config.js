require('dotenv').config()

module.exports = {
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    testerEmail: process.env.TESTER_EMAIL,
    testerPassword: process.env.TESTE_PASSWORD
}