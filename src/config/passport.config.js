const passport = require ('passport')
const local = require ('passport-local')
const Users = require('../dao/models/Users.model')
const { createHash } = require('../utils/cryptPassword.util')
const { passwordValidate } = require('../utils/cryptPassword.util')

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
            const newUser = await Users.create(newUserInfo);

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


    passport.serializeUser((user,done) =>{
        done(null,user.id)
    })
    passport.deserializeUser(async(id,done) =>{
        const user = await Users.findById(id)
        done(null,user)
    })
}

module.exports = initializePassport