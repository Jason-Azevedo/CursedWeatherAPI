const response = require('../utils/responses')

module.exports.getHourlyForecast = async (forecastRepo, req, res) => {
    const {lon, lat, units, count} = req.query

    if (!lon || !lat) 
        return response.badRequest(res, "The lon and lat fields are required")
    

    const forecast = await forecastRepo.getForecastedHours(lat, lon, units, count)
    response.ok(res, forecast)
}

module.exports.getDailyForecast = async (forecastRepo, req, res) => {
    const {lon, lat, units, count} = req.query

    if (!lon || !lat) 
        return response.badRequest(res, "The lon and lat fields are required")

    const forecast = await forecastRepo.getForecastedDays(lat, lon, units, count)
    response.ok(res, forecast)
}