const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    id: Number,
    username: String,
    email: String,
    password: String,
    roles: [],
    discordId: String

})

module.exports = mongoose.model('Post', postSchema);