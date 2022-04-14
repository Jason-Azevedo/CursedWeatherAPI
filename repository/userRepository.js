const UserModel = require('../model/userScheme')

/**
 * Creates and saves a new user, will throw any error that occurs
 * @param {*} user The new user to be created
 * @returns The created users id in an object: {_id: id}
 */
module.exports.create = async (user) => {
    return await new UserModel(user)
        .save()
}

/**
 * Updates an already existing user, will throw any error that occurs
 * @param {*} user The user to be updated, must have an _id field
 * @returns 
 */
module.exports.update = async (user) => {
    return await UserModel.findOneAndUpdate({_id: user._id}, user, {new: true})
}

/**
 * Deletes a user, will throw any error that occurs
 * @param {*} user The new user to be deleted
 * @returns 
 */
module.exports.delete = async (userId) => {
    return await UserModel.findOneAndDelete({_id: userId})
}

/**
 * Finds a user based on the user id, will throw any error that occurs
 * @param {*} userId The id of the user to find
 * @returns A user object or null
 */
module.exports.findById = async (userId) => {
    return await UserModel.findById(userId)
}

/**
 * Finds a user based on the user's email, will throw any error that occurs
 * @param {*} email Email of the user to find
 * @returns A user object or null
 */
module.exports.findByEmail = async (email) => {
    return await UserModel.findOne({email: email})
}
