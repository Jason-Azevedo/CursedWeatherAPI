const ApiKeyModel = require('../model/apikeyScheme')

/**
 * Creates a new apikey
 * @param {*} apiKeyModel The apikey model to be created 
 * @throws Any error that occurs
 * @returns The created apikey id in an object: {_id: id}
 */
module.exports.create = async (apiKeyModel) => {
    return await new ApiKeyModel(apiKeyModel)
        .save()
}

/**
 * Updates an apikey's data, not the key itself
 * @param {*} apiKeyModel The apikey model to update with, must contain an apikey
 * @throws Any error that occurs
 * @returns 
 */
module.exports.update = async (apiKeyModel) => {
    // Destructuring to prevent elements being added that are not supposed to be there
    const {disabled, apiKey} = apiKeyModel

    return await ApiKeyModel.findOneAndUpdate({apiKey}, {disabled})
}

/**
 * Deletes an apikey and it's data
 * @param {*} apiKeyModel The apiKeyModel to be deleted, must contain userId and apiKey
 * @throw Any error that occurs
 * @returns 
 */
module.exports.delete = async (apiKeyModel) => {
    const {userId, apiKey} = apiKeyModel

    // And is there to ensure that a user can only delete their api keys
    return await ApiKeyModel.findOneAndDelete({$and: [{$eq: {userId}}, {$eq: {apiKey}}]})
}

/**
 * Deletes all apikeys that belong to a certain user 
 * @param {*} userId The user id to delete api keys for 
 * @throws Any error that occurs
 * @returns 
 */
module.exports.deleteByUserId = async (userId) => {
    return await ApiKeyModel.deleteMany({userId})
}

/**
 * Finds an apikey by its id
 * @param {*} id The id of the apikey to find
 * @throws Any error that occurs
 * @returns An apikey model or null
 */
module.exports.findById = async (id) => {
    return await ApiKeyModel.findById(id)
}

/**
 * Finds the apikey model data via the apikey
 * @param {*} apiKey The apikey 
 * @throws Any error that occurs
 * @returns The apikey model or null
 */
module.exports.findByApiKey = async (apiKey) => {
    return await ApiKeyModel.findOne({apiKey: {$eq: apiKey}}).exec()
}

/**
 * Finds all apikeys that belong to a certain user
 * @param {*} userId The id of the user to get the apikeys for
 * @throws Any error that occurs
 * @returns The apikeys or null
 */
module.exports.findByUserId = async (userId) => {
    return await ApiKeyModel.find({userId: {$eq: userId}}).exec()
}