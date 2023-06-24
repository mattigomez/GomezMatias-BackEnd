const {Router} = require('express')
const UserDTO = require('../DTO/users.dto')
const ErrorRepository = require('../repository/errors.repository')

const router = Router()

router.get('/', (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      const userSession = req.session.user
      const UserDto = new UserDTO(userSession)
      return res.status(200).json(UserDto)
    }
      next(new ErrorRepository(404))
  } catch (error) {
    next(error)
  }
})


module.exports = router