const userAuth = require('../auth/userAuth')

// Setup
const reqMock = {
    session: {
        userId: 'secret-user-id',
        loggedIn: true
    }
}

let resMock = {status: () => {}}
let nextMock
let userRepoMock = {}

const unAuthResponse = {
    status: 401,
    message: "Unauthorized"
}

describe('User Auth Middleware', () => {
    // Setup
    beforeEach(() => {
        resMock.json = jest.fn()
        nextMock = jest.fn()
    })

    test('Logged in user should work', async () => {
        await userAuth(userRepoMock, reqMock, resMock, nextMock)

        expect(nextMock).toHaveBeenCalled()
    })

    test('Not logged in user should not work', async () => {
        // Setup
        const notLoggedInReqMock = {
            session: {
                userId: undefined,
                loggedIn: undefined
            }
        }

        await userAuth(userRepoMock, notLoggedInReqMock, resMock, nextMock)

        expect(nextMock).not.toHaveBeenCalled()
        expect(resMock.json).toHaveBeenCalledWith(
            expect.objectContaining(unAuthResponse)
        )
    })
})