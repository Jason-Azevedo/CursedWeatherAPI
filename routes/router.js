const userRouter = require('./userRouter')
const forecastRouter = require('./forecastRouter')
const apikeyRouter = require('./apikeyRouter')
const response = require('../utils/responses')

module.exports.registerRoutes = function(app) {
    // Register routers
    app.use('/v1/forecast', forecastRouter)
    app.use('/apikey', apikeyRouter)
    app.use('/user', userRouter)


    // Not Found
    app.use('*', (req, res) => response.notFound(res))
}