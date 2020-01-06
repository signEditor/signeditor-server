const mongoose = require("../db/mongodb").mongoose

const UserSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    username: { type: String, unique: true },
    password: String,
    passwordSalt: String,
    createtime: { type: Date, default: Date.now },
}, {
    collection: "users"
})
UserSchema.index({id: 1})
UserSchema.index({username: 1})

const User = mongoose.model("user", UserSchema)

User.syncIndexes()

module.exports = User