const ServerError = require("../utils/error").ServerError

module.exports = function(){
    return async function(ctx, next){
        try{
            await next()
        } catch(err){
            if(err instanceof ServerError){
                ctx.status = err.status || 500
                ctx.body = {
                    code: err.code,
                    message: err.message
                }
            } else {
                ctx.status = err.status || 500
                ctx.body = {
                    code: 100,
                    message: err.message
                }
            }
        }
    }
}