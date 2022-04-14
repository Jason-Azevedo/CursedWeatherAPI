# CursedWeatherAPI
A restful weather api built with the Node, Express and MongoDB. Inspired by Accuweather Organization. The features of the api:
* User accounts
* User authentication 
* Sessions
* API keys
* API key authentication
* Generation of fake weather data

## Requirements/Dependencies
The requirements and their versions needed for this project to run

* [NodeJS 16.14.2](https://nodejs.org) 
* [MongoDB 4.4.5](https://www.mongodb.com)

## Project Setup
Quick rundown of how to setup the project:

1. Make sure you have the requirements
2. Clone this project
3. In the root directory, run `npm i` or `npm install`
4. Setup the enviorment variables in a .env file again in the root directory:
``` 
MONGO_URL="mongodb url with database name eg: mongodb://localhost:27017/cursedapi"
SESSION_SECRET="your session secret"
LISTEN_ADDRESS="The network interface you want the server to listen on, eg: 127.0.0.1"
LISTEN_PORT=Your port you want the server to listen on eg: 3001
```
5. Done!

## Running the project
In the root of the project run `npm run start:dev`

You should then see [nodemon](https://www.npmjs.com/package/nodemon) start with the
message `server listening on {address}:{port}`

## How to use the Backend API
Here is a rundown on the various api methods that can be used, as well as how to use
them on the backend server:

**NOTE:** All requests are sent and received in `json` format. 

**NOTE:** The `localhost:3001` address commonly used is where the server is listening at,
this can be changed in the .env file. When you run the backend it will log to the console the address
where the server is listening at.

**NOTE:** All the non forecast methods are designed to work with a frontend, however it will
work with anything that supports cookies like [Postman](https://www.postman.com)

## Table of API Methods
* [Success and different Error responses](#error-and-success-response)
    * [Error Respones](#error)
    * [Bad Request Response](#bad-request-response)
    * [Success Response](#success-response)
    * [Unauthorized Response](#unauthorized-response)
* User methods:
    * [Signup](#signup)
    * [Login](#login)
    * [Logout](#logout)
    * [Update User Account](#update-user-account)
    * [Delete User Account](#delete-user-account)
* API keys:
    * [Create API key](#create-api-key)
    * [Get API keys](#get-api-keys)
    * [Update API key](#update-api-key)
    * [Delete API key](#delete-api-key)
* Forecast methods:
    * [Hourly Weather Forecast](#hourly-weather-forecast)
    * [Daily Weather Forecast](#daily-weather-forecast)

## Success and different Error responses

### Error Response
During any of the requests, if an error occurs you will receive the following response:

``` JSON
{
    "status": 500,
    "error": "The error here"
}
```

### Bad Request Response
If the api receives and impartial or invalid parameters for a request you will get the following response:

``` JSON
{
    "status": 400,
    "message": "Bad Request",
    "description": "The reason for the response"
}
```

### Success Response
If any request has successfully been completed you will receive 
the following reponse, if there is no data then the data property won't be included in the response 

``` JSON
{
    "status": 200,
    "message": "Success",
    "data": []
}
```

### Unauthorized Response
If you attempt to access certain routes without logging or
using a valid api key, you will receive this response:

``` JSON 
{
    "status": 401,
    "message": "Unauthorized"
}
```

## Signup:
``` 
POST http://localhost:3001/user/signup
```

Body of the post request, all the fields are required.

If the user already exists the server will respond with a
Bad Request response (Invalid Credentials) 

``` JSON
{
    "username": "user",
    "email": "user@something.com",
    "password": "secret"
}
```

## Login

**NOTE:** This project uses cookies for sessions when logging in and so forth.

``` 
POST http://localhost:3001/user/login
```

Body of the post request

``` JSON
{
    "email": "user@something.com",
    "password": "secret"
}
```

The api response upon successfully logging in:
``` JSON
{
    "status": 200,
    "message": "Success",
    "data": [
        {
            "username": "username",
            "email": "email@something.com"
        }
    ]
}
```

## Logout 
```
GET http://localhost:3001/user/logout
```

Responds with success response

## Update User Account

```
PATCH http://localhost:3001/user
```

Body of the post request:
``` JSON
{
    "username": "username", 
    "email": "email", 
    "password": "secret"
}
```
Success response:
``` JSON
{
    ...
    "data": [
        {
            "username": "username",
            "email": "email"
        }
    ]
}
```

## Delete User Account
Be sure if you want to do this, the api won't ask you to confirm :')

``` 
GET http://localhost:3001/user/delete
```

## API Keys

### Create API key

```
POST http://localhost:3001/apikey
```

Success response with the following data:

``` JSON 
{
    ...
    "data": [
        {
            "apiKey": "key",
            "disabled": false
        }
    ]
}
```

### Get API keys
``` 
GET http://localhost:3001/apikey
```

Success response with the following data:
``` JSON
{
    ...
    "data": [
        {
            "apiKey": "key",
            "disabled": false
        }
    ]
}
```

### Update API key
```
PATCH http://localhost:3001/apikey/{apikey}
```

Body of the request:
``` JSON
{
    "disabled": true
}
```

Success response with the following data:
``` JSON
{
    ...
    "data": [
        {
            "apiKey": "key",
            "disabled": true
        }
    ]
}
```

### Delete API key
```
DELETE http://localhost:3001/apikey/{apikey}
```

Responds with the success response.

## Forecast Methods:
**NOTE:** For the forecast methods you must include your apikey 
in the `x-api-key` header for each request.

Both hourly and daily methods take the following http query parameters

* `lat` - Latitude (required)
* `lon` - Longitude (required)
* `units` - The units to return the data in: 'metric',
    'standard' or 'imperial'
* `count` - The amount of forecasted days/hours to return

### Hourly Weather Forecast
``` 
GET http://localhost:3001/v1/forecast/hourly?lat={lat}&lon={lon}
```

Responds with a success response: 
``` JSON
{
    ...
    "data": [
        {
            "forecast_hour": 1654796378,
            "weather_type": "Cloudy",
            "temp": 27.06,
            "feels_like": 23.65,
            "humidity": 38,
            "uvi": 5
        }
    ]
}
```

### Daily Weather Forecast
``` 
GET http://localhost:3001/v1/forecast/daily?lat={lat}&lon={lon}
```

Responds with a success response: 
``` JSON
{
    ...
    "data": [
        {
            "forecast_date": 1654796378,
            "weather_type": "Cloudy",
            "max_temp": 27.06,
            "min_temp": 17.06,
            "humidity": 38,
            "uvi": 5
        }
    ]
}
```
