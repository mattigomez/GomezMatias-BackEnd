const UserRepository = require('../repository/users.repository')

const userDao = new UserRepository()

module.exports = userDao

/* 
async function usersCreate(userInfo){
	try {
		const userRepository = new UserRepository()
    const user = await userRepository.createUser(userInfo)
    return user
	} catch (error) {
		return error
	}
}


module.exports = usersCreate */