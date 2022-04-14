const router = require('express').Router()
const userAuth = require('../auth/userAuth')
const apiKeyRepo = require('../repository/apiKeyRepository')
const {getApiKeys, createAPIKey, updateAPIKey, deleteAPIKey} = require('../controller/apikeyController')

// Middleware
// User auth
router.use((req, res, next) => userAuth(apiKeyRepo, req, res, next))

// Routes
// Note: These routes are meant to be used by a frontend with a logged in user
router.get('/', (req, res) => getApiKeys(apiKeyRepo, req, res))
router.post('/', (req, res) => createAPIKey(apiKeyRepo, req, res))
router.route('/:apikey')
    .patch((req, res) => updateAPIKey(apiKeyRepo, req, res))
    .delete((req, res) => deleteAPIKey(apiKeyRepo, req, res))

module.exports = router