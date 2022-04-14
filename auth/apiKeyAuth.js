const response = require('../utils/responses')

module.exports = async function (apiKeyRepo, req, res, next) {
    const apiKey = req.get('x-api-key')

    // No apikey provided
    if (!apiKey) return response.badRequest(res, "No api key provided in the 'x-api-key' header")

    // Validate api key
    // This isn't a good way to validate api keys but that
    // is beyond the scope of this project
    try {
        const apiKeyModel = await apiKeyRepo.findByApiKey(apiKey)

        if (!apiKeyModel) return response.badRequest(res, "Invalid api key")
        if (apiKeyModel.disabled) return response.badRequest(res, "API key is disabled")

        // Successfully validated API key
        next()

    } catch(e) {
        // Send the error to the error middleware to log and handle
        next(e)
    }
}