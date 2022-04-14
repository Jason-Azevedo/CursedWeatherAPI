const { array } = require("yargs")

// Commonly used error messages, to keep things consistent
module.exports.INVALID_CREDENTIALS = "Invalid Credentials"
module.exports.INTERNAL_SERVER_ERROR = "Internal Server Error"

/**
 * Sends an generic 500 Internal Server Error response to the client.
 * 
 * @param {*} res The response object from express framework.
 */
module.exports.error = (res) => {
    res.status(500)
    res.json({
        status: 500,
        error: 'Internal Server Error'
    })
}

/**
 * Sends a generic 200 OK response to the client with any provided data
 * 
 * @param {*} res The response object from express framework
 * @param {*} data Potential data to be sent to the client
 */
module.exports.ok = (res, data) => {
    const response = {
        status: 200,
        message: 'Success'
    }

    if (data && Array.isArray(data)) response.data = data
    else if (data) response.data = [data]

    res.json(response)
}

/**
 * Sends a 401 Unauthorized response to the client
 * 
 * @param {*} res The response object from express framework
 */
module.exports.unAuth = (res) => {
    res.status(401)
    res.json({
        status: 401,
        message: 'Unauthorized'
    })
}

/**
 * Sends a 400 Bad Request reponse to the client
 * 
 * @param {*} res The response object from express framework
 * @param {*} desc Description for the response
 */
module.exports.badRequest = (res, description) => {
    res.status(400)
    res.json({
        status: 400,
        message: 'Bad Request',
        // Only add desc if it is not undefined
        ...description && {description}
    })
}

/**
 * Sends a 404 Not Found reponse to the client
 * 
 * @param {*} res The response object from express framework
 */
module.exports.notFound = (res) => {
    res.status(404)
    res.json({
        status: 404,
        message: 'Not Found'
    })
}