require('dotenv').config()

module.exports = {
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    tester_email: process.env.TESTER_EMAIL,
    tester_password: process.env.TESTER_PASSWORD
}