const jwt = require('jsonwebtoken');
const config = require('config')
const { checkPassword } = require("./users")
const ServerError = require("../utils/error").ServerError

class FailPasswordError extends ServerError{constructor(){super(1002001001, "用户密码错误", 400)}}
exports.applyToken = async function(username, password){

    let user = await checkPassword(username, password)
    if(!user){
        throw new FailPasswordError()
    }

    return jwt.sign({
        uid: user.id, 
        iat: parseInt(new Date().getTime() / 1000),
        exp: parseInt(new Date().getTime() / 1000) + config.get("jwt.tokentime"),
    }, config.get("jwt.secret"))
}