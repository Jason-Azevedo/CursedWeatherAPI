const req = require('express/lib/request')
const apiKeyAuth = require('../auth/apiKeyAuth')

// Setup
let apiKey = 'apikey' 
let next

const reqMock = {get: () => apiKey,}
const resMock = {status: () => {}}
const userRepo = {}

beforeEach(() => {
    apiKey = 'apikey'
    next = jest.fn()
    resMock.json = jest.fn()
    userRepo.findByApiKey = 
        jest.fn(key => key === 'apikey' ? {username: 'User'} : null)
})

describe('Api Key Auth Middleware', () => {
    // Setup

    test('Valid api key should work', async () => {
        await apiKeyAuth(userRepo, reqMock, resMock, next)

        expect(next).toHaveBeenCalled()
    })

    test('Invalid api key should not work', async () => {
        // Setup
        apiKey = "wrong"

        await apiKeyAuth(userRepo, reqMock, resMock, next)

        expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining(
            {
                status: 400,
                message: "Bad Request",
                description: "Invalid api key"
            }
        ))
    })
})