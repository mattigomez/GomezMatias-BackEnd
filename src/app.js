const express = require('express')
const session = require('express-session')
const handlebars = require('express-handlebars')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const mongoConnect = require('../db')
const router = require('./router')
const initializePassport = require('./config/passport.config')
const passport = require('passport')
const logger = require('./utils/logger.util')


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://admin:admin@cluster0.djfkdgp.mongodb.net/Sessions?retryWrites=true&w=majority',
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},ttl:15, 
    }),
    secret: 'cookieSecret',
    resave: false,
    saveUninitialized: false

}))

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const hbs = handlebars.create({
  handlebars: allowInsecurePrototypeAccess(require('handlebars')),
  defaultLayout: 'main'
});
app.engine('handlebars', hbs.engine);
app.set('views',__dirname + '/views')

mongoConnect()
router(app)

module.exports = app
