const response = require('../utils/responses')
const crypto = require('crypto')

module.exports.getApiKeys = async (apiKeyRepo, req, res) => {
    try {
        const userId = req.session.userId
        const apiKeys = await apiKeyRepo.findByUserId(userId)

        // Remove unwanted properties
        const keys = apiKeys.map(({apiKey, disabled}) => {
            return { apiKey, disabled }
        })

        response.ok(res, keys)
    } catch(e) {
        console.error(e)
        response.error(res)
    }
}

module.exports.createAPIKey = async (apiKeyRepo, req, res) => {
    try {
        // Setup
        const userId = req.session.userId

        // Create api key
        const apiKey = crypto.randomUUID()

        // Save the api key
        await apiKeyRepo.create({ userId, apiKey, disabled: false })

        response.ok(res, { apiKey: apiKey, disabled: false })
    } catch(e) {
        console.error(e)
        response.error(res)
    }
}

module.exports.updateAPIKey = async (apiKeyRepo, req, res) => {
    try {
        // Fetch the user from db
        const userId = req.session.userId
        const apiKey = req.params.apikey
        const {disabled} = req.body

        // Check if required paramter(s) are not undefined
        if (typeof disabled !== 'boolean') 
            return response.badRequest(res, "The disabled field is required")

        // Save the update
        // Todo: Fix null getting place in the apiKey array
        await apiKeyRepo.update({ userId, apiKey, disabled })

        response.ok(res, { apiKey, disabled })
    } catch(e) {
        console.error(e)
        response.error(res)
    }
}

module.exports.deleteAPIKey = async (apiKeyRepo, req, res) => {
    try {
        // Fetch the user from db
        const userId = req.session.userId
        const apiKey = req.params.apikey

        // Delete the api key
        await apiKeyRepo.delete({ userId, apiKey })

        response.ok(res)
    } catch(e) {
        console.error(e)
        response.error(res)
    }
}