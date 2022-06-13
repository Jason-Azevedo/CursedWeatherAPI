const response = require('../utils/responses')
const {INVALID_CREDENTIALS} = response

module.exports.login = async (userRepo, req, res) => {
    const {email, password} = req.body

    // Check for emtpy fields
    if (!email || !password) 
        return response.badRequest(res, INVALID_CREDENTIALS)

    // Attempt login
    try {
        const user = await userRepo.findByEmail(email)

        // Check if the user exists and if the password matches
        if (!user || password !== user.password) 
            return response.badRequest(res, INVALID_CREDENTIALS)

        // User exists and password matches, log in user
        req.session.loggedIn = true
        req.session.userId = user._id

        // Send the username to client
        response.ok(res, {username: user.username})
    } catch(err) {
        // Log error 
        console.error(err)
        response.error(res)
    }
}

module.exports.logout = (req, res) => {
    if (req.session) {
        req.session.destroy(e => {
            if (e) {
                // Log error
                console.error(e)
                return response.error(res)
            } 
            response.ok(res)
        })
    }
}

module.exports.signup = async (userRepo, req, res) => {
    const {username, email, password} = req.body

    // Check if the fields are empty
    if (!username || !email || !password) 
        return response.badRequest(res, "Username, email or password field cannot be empty")

    // Check if the user exists
    try {
        const existingUser = await userRepo.findByEmail(email)
        if(existingUser) 
            return response.badRequest(res, INVALID_CREDENTIALS)

        // Create the user
        await userRepo.create({username: username, email: email, password: password})

        response.ok(res)
    } 
    catch(err) { 
        // Log the error
        console.log(err)
        response.error(res) 
    }
}

module.exports.updateUser = async (userRepo, req, res) => {
    const {username, email, password} = req.body

    // None of the following fields were sent
    if (!username && !email && !password) 
        return response.badRequest(res, "There must be atleast one field: username, email or password")

    try {
        const currentUser = await userRepo.findById(req.session.userId)

        // If they changed email, check to see if that email isn't in use
        if (email && email !== currentUser.email) {
            const existingUser = await userRepo.findByEmail(email)

            // Email in use and it is not the user's current email
            if (existingUser) 
                return response.badRequest(res, INVALID_CREDENTIALS)
        }

        const updatedUser = await userRepo.update(
            {
                _id: req.session.userId,
                username, 
                email,
                password
            }
        )

        // Remove unwanted properties
        const user = {
            username: updatedUser.username,
            email: updatedUser.email,
        }

        // Respond with updated fields, except password
        response.ok(res, user)
    } catch(e) {
        // Log the error
        console.error(e)
        response.error(res)
    }
}

module.exports.deleteUser = async (userRepo, apiKeyRepo, req, res) => {
    try {
        // Delete the user
        await userRepo.delete(req.session.userId)
        await apiKeyRepo.deleteByUserId(req.session.userId)

        // Clear their session data
        req.session.destroy(e => {
            if (e) {
                // Log error
                console.error(e)
                response.error(res)
            }

            response.ok(res)
        })
    } catch(e) {
        // Log the error
        console.error(e)
        response.error(res)
    }
}