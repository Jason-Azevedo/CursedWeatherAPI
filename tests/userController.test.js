const userController = require('../controller/userController')
const {INVALID_CREDENTIALS, INTERNAL_SERVER_ERROR} = require('../utils/responses')

// This user object is mean't to be used as a reference only!
const user = {
    _id: 's',
    username: 'User',
    email: 'user@something.com',
    password: 'Password',
    apiKeys: []
}
Object.freeze(user) // Make the user object immutable :)

let reqMock, resMock, userRepoMock, okResponse

const invalidCredentialsResponse = {
    status: 400,
    message: "Bad Request",
    description: INVALID_CREDENTIALS
}

const badRequestNoFieldsResponse = {
    status: 400,
    message: "Bad Request",
    description: "There must be atleast one field: username, email or password"
}

// NOTE: This runs before each test not describe block!
beforeEach(() => {
    okResponse = {
        status: 200,
        message: 'Success'
    }

    reqMock = {
        session: {
            destroy: (cb) => cb()
        },
        body: {
            username: user.username,
            email: user.email,
            password: user.password
        }
    }

    resMock = {
        json: jest.fn(), 
        sendStatus: jest.fn(),
        status: jest.fn()
    }

    userRepoMock = {
        findByEmail : jest.fn(email => email === user.email ? user : null),
        findById: jest.fn(id => id === user.id ? user : null),
        create: jest.fn(() => true),
        update: jest.fn(user => user),
        delete: jest.fn()
    }

    apiKeyRepoMock = { deleteByUserId: jest.fn() }
})

describe('User controller login', () => {

    test('Existing user login with correct credentials should work', async () => {
        okResponse.data = [{username: user.username}]

        await userController.login(userRepoMock, reqMock, resMock)

        // Correct response
        expect(resMock.json).toBeCalledWith(
            expect.objectContaining(okResponse)
        )
        // Session logged in state set to true
        expect(reqMock.session.loggedIn).toBeTruthy()
        expect(reqMock.session.userId).toBeDefined()
    })

    test('Non existing user login should not work', async () => {
        //Set the email to one that doesn't exist
        reqMock.body.email = "idontexist@mail.com"

        await userController.login(userRepoMock, reqMock, resMock)

        // Generate error response
        expect(resMock.json).toBeCalledWith(
            expect.objectContaining(invalidCredentialsResponse)
        )
        // Session logged in state and user id should not exist 
        expect(reqMock.session.loggedIn).toBeUndefined()
        expect(reqMock.session.userId).toBeUndefined()
    })

    test('No provided credentials login should not work', async () => {
        // Clear the body
        reqMock.body = {}

        await userController.login(userRepoMock, reqMock, resMock)

        // Generate error response
        expect(resMock.json).toHaveBeenCalledWith(
            expect.objectContaining(invalidCredentialsResponse)
        )
        // Session logged in state and user id should not exist 
        expect(reqMock.session.loggedIn).toBeUndefined()
        expect(reqMock.session.userId).toBeUndefined()
    })
})
        
describe('User controller signup', () => {

    test('Signup non-existing user should work', async () => {
        // Set the email to one that doesn't exist
        reqMock.body.email = "idontexist@mail.com"

        await userController.signup(userRepoMock, reqMock, resMock)

        // Successful reponse
        expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining(okResponse))
    })

    test('Signup existing user should not work', async () => {
        await userController.signup(userRepoMock, reqMock, resMock)

        // Unsuccessful reponse (code: 400, invalid credentials)
        expect(resMock.json).toHaveBeenCalledWith(
            expect.objectContaining(invalidCredentialsResponse)
        )
    })

    test('No provided fields for signup should not work', async () => {
        await userController.signup(userRepoMock, reqMock, resMock)

        // Unsuccessful reponse (code: 400, invalid credentials)
        expect(resMock.json).toHaveBeenCalledWith(
            expect.objectContaining(invalidCredentialsResponse)
        )
    })
})

describe('User controller update user', () => {

    test('Non existing email and other changes should work', async () => {
        // Setup
        reqMock.session._id = user._id
        reqMock.body = {
            username: "newUsername",
            email: "jeffreybeizos@a.com",
            password: "newPassword"
        }

        okResponse.data = [
            {
                    username: reqMock.body.username,
                    email: reqMock.body.email
            }
        ]

        await userController.updateUser(userRepoMock, reqMock, resMock)

        expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining(okResponse))
    })

    test('Change email to already in use email should not work', async () => {
        userRepoMock.findByEmail = jest.fn(email => email === "inuse@mail.com" ? user : null),
        reqMock.body.email = "inuse@mail.com"

        await userController.updateUser(userRepoMock, reqMock, resMock)

        expect(resMock.json).toHaveBeenCalledWith(
            expect.objectContaining(invalidCredentialsResponse)
        )
    })

    test('No changes should not work', async () => {
        // Remove fields
        reqMock.body = {} 

        await userController.updateUser(userRepoMock, reqMock, resMock)

        expect(resMock.json).toHaveBeenLastCalledWith(
            expect.objectContaining(badRequestNoFieldsResponse)
        )
    })
})

describe('User controller delete user', () => {

   test("Delete existing user should work", async () => {
        await userController.deleteUser(userRepoMock, apiKeyRepoMock, reqMock, resMock)

        expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining(okResponse))
   }) 

   test("Delete non-existing user should not work", async () => {
        reqMock.session.userId = 'notreal'

        await userController.deleteUser(userRepoMock, apiKeyRepoMock, reqMock, resMock)

        expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining(okResponse))
   }) 
})
