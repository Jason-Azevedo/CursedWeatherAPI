const router = require('express').Router()
const {
    login, 
    logout,
    signup,
    deleteUser,
    updateUser } = require('../controller/userController')
const userRepo = require('../repository/userRepository')
const apiKeyRepo = require('../repository/apiKeyRepository')
const auth = require('../auth/userAuth')

// Setup routes
router.post('/login', (req, res) => login(userRepo, req, res))
router.post('/signup', (req, res) => signup(userRepo, req, res))

// Auth routes
// Auth setup
router.use('/logout', (req, res, next) => auth(userRepo, req, res, next))
router.use('/', (req, res, next) => auth(userRepo, req, res, next))

// Routes
router.get('/logout', (req, res) => logout(req, res))
router.delete('/', (req, res) => deleteUser(userRepo, apiKeyRepo, req, res))
router.patch('/', (req, res) => updateUser(userRepo, req, res))

module.exports = router