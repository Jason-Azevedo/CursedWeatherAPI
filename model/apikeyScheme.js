const mongoose = require('mongoose')

const apiKeySchema = mongoose.Schema({
    userId: {type: String, required: true},
    apiKey: {type: String, required: true},
    disabled: {type: Boolean, default: false}
})

module.exports = mongoose.model('apiKeys', apiKeySchema)
