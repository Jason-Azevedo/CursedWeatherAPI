const apikeyController = require('../controller/apikeyController')

const user = {
    _id: 's',
    apiKeys: [
        {apiKey: 'firstkey', disabled: false},
    ]
}

const errorResponse = {
    status: 500,
    message: "Internal Server Error"
}

const badRequestNoFieldsResponse = {
    status: 400,
    message: "Bad Request",
    description: "The disabled field is required"
}

let apiKeyRepoMock, reqMock, resMock, okResponse

beforeEach(() => {
    okResponse = {
        status: 200,
        message: "Success"
    }

    apiKeyRepoMock = {
        findById: jest.fn((id) => id === user._id ? user : null),
        findByUserId: jest.fn((id) => id === user._id ? [{apiKey: "s"}] : null),
        update: jest.fn(user => user),
        delete: jest.fn(),
        create: jest.fn()
    }

    reqMock = {
        session: { userId: user._id },
        params: {apikey: user.apiKeys[0].apiKey},
        body: {disabled: true}
    }

    resMock = { json: jest.fn(), status: jest.fn() }
})

test('Api key controller get all user api keys should work', async () => {
    // Setup
    okResponse.data = [{apiKey: 's'}]

    await apikeyController.getApiKeys(apiKeyRepoMock, reqMock, resMock)

    expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining(okResponse))
})

test('Api key controller create api key', async () => {
    await apikeyController.createAPIKey(apiKeyRepoMock, reqMock, resMock)

    // Key successfully created without any errors
    expect(resMock.json).not.toHaveBeenCalledWith(
        expect.objectContaining(errorResponse)
    )
})

describe('Api key controller update api key', () => {

    test('Valid updates should work', async () => {
        await apikeyController.updateAPIKey(apiKeyRepoMock, reqMock, resMock)

        // Key successfully updated without any errors
        expect(resMock.json).not.toHaveBeenCalledWith(
            expect.objectContaining(errorResponse)
        )
    })

    test('Missing required fields in body should not work', async () => {
        // Clear the request body
        reqMock.body = {}

        await apikeyController.updateAPIKey(apiKeyRepoMock, reqMock, resMock)

        expect(resMock.json).toHaveBeenCalledWith(
            expect.objectContaining(badRequestNoFieldsResponse)
        )
    })
})

test('Api key controller delete api key', async () => {
    await apikeyController.deleteAPIKey(apiKeyRepoMock, reqMock, resMock)

    expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining(okResponse)
    )
})