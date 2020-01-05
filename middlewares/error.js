module.exports = function(){
    return async function(ctx, next){
        try{
            await next()
        } catch(err){
            ctx.status = err.status || 500
            ctx.body = {
                code: 100,
                message: err.message
            }
        }
    }
}