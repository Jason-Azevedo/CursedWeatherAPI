/**
 * Converts a Kalvin temperature to Fahrenheit temperature
 * @param {Number} kelvin - The Kelvin temperature to conver to Fahrenheit
 * @returns The newly converted Fahrenheit temperature
 */
module.exports.fromK = (kelvin) => (kelvin - 273.15) * (9 / 5) + 32