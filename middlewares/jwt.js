const jwt = require('jsonwebtoken');
const config = require('config')

module.exports = function(){

    return function(ctx, next){
        let authorization = ctx.headers.authorization || ctx.headers.Authorization

        if(authorization == undefined){
            ctx.throw(401, "没有附带 Authorization")
        }

        try{
            ctx.jwtpayload = jwt.verify(authorization, config.get("jwt.secret"))
        } catch(err){
            if(err instanceof jwt.TokenExpiredError){
                ctx.throw(403, "token已失效")
            } else if(err instanceof jwt.NotBeforeError){
                ctx.throw(403, `token需要在[${err.date.toUTCString()}]之后有效`)
            } else if(err instanceof jwt.JsonWebTokenError){
                ctx.throw(403, "身份验证失败")
            } else {
                throw err
            }
        }
        return next()
    }
}