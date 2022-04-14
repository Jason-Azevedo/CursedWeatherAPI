const router = require('express').Router()
const apiKeyAuth = require('../auth/apiKeyAuth')
const {getHourlyForecast, getDailyForecast} = require('../controller/forecastController')
const forecastRepo = require('../repository/forecastRepository')
const apiKeyRepo = require('../repository/apiKeyRepository')

// Middleware 
// Api key authentication
router.use((req, res, next) => apiKeyAuth(apiKeyRepo, req, res, next))

// Setup routes
router.get('/hourly', (req, res) => getHourlyForecast(forecastRepo, req, res))
router.get('/daily', (req, res) => getDailyForecast(forecastRepo, req, res))

module.exports = router