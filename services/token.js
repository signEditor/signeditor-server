const jwt = require('jsonwebtoken');
const config = require('config')

exports.applyToken = function(username, password){

    //TODO: 验证用户密码

    return jwt.sign({
        userId: '123123', 
        iat: parseInt(new Date().getTime() / 1000),
        exp: parseInt(new Date().getTime() / 1000) + config.get("jwt.tokentime"),
    }, config.get("jwt.secret"))
}