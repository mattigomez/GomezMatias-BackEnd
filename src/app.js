const express = require('express')
const session = require('express-session')
const handlebars = require('express-handlebars')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const mongoConnect = require('../db')
const router = require('./router')

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

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

mongoConnect()
router(app)

module.exports = app
