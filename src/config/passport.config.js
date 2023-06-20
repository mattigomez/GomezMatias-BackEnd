const passport = require ('passport')
const local = require ('passport-local')
const Users = require('../dao/models/Users.model')
const GithubStrategy = require ('passport-github2')
const { createHash } = require('../utils/cryptPassword.util')
const { passwordValidate } = require('../utils/cryptPassword.util')
const usersCreate = require('../dao/users.dao')


const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register',
    new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
    async (req,username,password,done) =>{
        try {
            const { first_name, last_name, email, password } = req.body
            const user = await Users.findOne({email: username})

            if(user){
                console.log('Usuario ya existe');
                return done(null, false)
            }
            const newUserInfo = {
                first_name,
                last_name,
                email,
                password: createHash(password)
              };
            const newUser = await usersCreate(newUserInfo);

            done(null,newUser)

        } catch (error) {
            done(error)
        }
    }))

    passport.use('login', new LocalStrategy({usernameField: 'email'},
    async (username,password,done) =>{
        try {
            const user = await Users.findOne({email: username})
            if(!user){
                console.log('El usuario no existe');
                return done(null,false)
            }
            
            if(!passwordValidate(password, user))return done(null,false)

            done(null,user)

        } catch (error) {
            done(error)
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.222cde0f92763d95',
        clientSecret: '9943ed504febae0036aea47fdfd4e60b958d0025',
        callbackURL: 'http://localhost:3000/auth/githubcallback'
    },async (accesToken, refreshToken,profile,done) => {
        try {
            /* console.log(profile) */

            const user = await Users.findOne({email: profile._json.email})

            if(!user){ const newUserInfo = {
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                password: ''
            }
            const newUser = await usersCreate(newUserInfo)
            return done(null,newUser)
            }

            done(null,user)

        } catch (error) {
            done(error)
        }
    }))

    passport.serializeUser((user,done) =>{
        done(null,user.id)
    })
    passport.deserializeUser(async(id,done) =>{
        try {
            const user = await Users.findById(id)
            done(null,user)
        } catch (error) {
            console.error(error)
        }
    })
}

module.exports = initializePassport