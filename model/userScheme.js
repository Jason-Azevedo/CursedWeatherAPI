const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    apiKeys: [{
        apiKey: {type: String, required: true}, 
        disabled: {type: Boolean, default: false}
    }] 
})

module.exports = mongoose.model('User', userSchema)