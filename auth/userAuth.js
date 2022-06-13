const response = require('../utils/responses')

module.exports = async (userRepo, req, res, next) => {
    // Check if the user is logged in 
    if(!req.session.userId || !req.session.loggedIn) {
        return response.unAuth(res)
    }

    // Other auth checks here

    // Success
    next()
}