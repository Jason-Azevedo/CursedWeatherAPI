const cTemp = require('../utils/celciusConverter')
const fTemp = require('../utils/fahrenheitConverter')

// Generates a Kelvin temperature forecast for a day
function generateKTemp() {
    return (Math.random() * 5) + 296
}

/**
 * Retrieves forecasted hours
 * @param lat - The latitude to fetch forecast for
 * @param lon - The longitude to fetch forecast for
 * @param units - The unit type to return forecast in (metric, imperial, standard), 
 * defaults to standard
 * @param count - The amount of forecasted hours to retrieve, max: 72, defaults to 12
 * @throws - Any exception that occurs
 * @returns - The forecasted hours for the specified location or null
 */
module.exports.getForecastedHours = async (lat, lon, units, count) => {

    // Get forecast from db or other server...
    // For this project I generate fake data instead

    // Sets the default value if count is out of bounds
    if (count > 72 || count < 1) count = 12

    const forecastedHours = {
        lat: lat,
        lon: lon,
        hourly: []
    }

    // Generate individual forecast hours
    for (let i = 0; i < count; i++) {
       const hour = {
           forecast_hour: Math.round(Date.now() / 1000) + (3600 * i),
           weather_type: i % 2 === 0 ? "Cloudy" : "Sunny",
           temp: generateKTemp(),
           feels_like: generateKTemp(),
           humidity: Math.floor(Math.random() * 100),
           uvi: Math.floor(Math.random() * 11)
       } 

       // Convert temperatures based on requested units
       switch (units) {
            case "metric":
                hour.temp = cTemp.fromK(hour.temp)
                hour.feels_like = cTemp.fromK(hour.feels_like)
                break
            case "imperial": 
                hour.temp = fTemp.fromK(hour.temp)
                hour.feels_like = fTemp.fromK(hour.feels_like)
                break
       }

       // Add the generated hour to forecastedHours 
       forecastedHours.hourly.push(hour)
    }

    return forecastedHours
}

/**
 * Retrieves the forecasted days
 * @param lat - The latitude to fetch forecast for
 * @param lon - The longitude to fetch forecast for
 * @param units - The unit type to return forecast in (metric, imperial, standard), 
 * defaults to standard
 * @param count - The amount of forecasted days to retrieve, max: 14, defaults to 7 
 * @throws - Any exception that occurs
 * @returns - The forecasted days for the specified location or null
 */
module.exports.getForecastedDays = async (lat, lon, units, count) => {

    // Get forecast from db or other server...
    // For this project I generate fake data instead

    // Sets the default value if count is out of bounds
    if (count > 14 || count < 1) count = 7

    const forecastedDays = {
        lat: lat,
        lon: lon,
        days: []
    }

    // Create todays date without any time 
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    // Generate individual forecast days
    for (let i = 0; i < count; i++) {
       const day = {
           forecast_date: Math.round(currentDate.getTime() / 1000) + (86400 * i),
           weather_type: i % 2 === 0 ? "Cloudy" : "Sunny",
           max_temp: generateKTemp(),
           min_temp: generateKTemp(),
           humidity: Math.floor(Math.random() * 100),
           uvi: Math.floor(Math.random() * 11)
       } 

       // Convert temperatures based on requested units
       switch (units) {
            case "metric":
                day.max_temp = cTemp.fromK(day.max_temp)
                day.min_temp = cTemp.fromK(day.min_temp)
                break
            case "imperial": 
                day.max_temp = fTemp.fromK(day.max_temp)
                day.min_temp = fTemp.fromK(day.min_temp)
                break
       }

       // Add the generated day to forecastedDays 
       forecastedDays.days.push(day)
    }

    return forecastedDays
}