const mongoose = require("../db/mongodb").mongoose

const UserSchema = new mongoose.Schema({
    id: String,
    username: String, // String is shorthand for {type: String}
    password: String,
    passwordSalt: String,
    createtime: { type: Date, default: Date.now },
})

const User = mongoose.model("user", UserSchema)

module.exports = User