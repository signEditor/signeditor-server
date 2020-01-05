const Ajv = require("ajv")


const ajv = new Ajv({
    useDefaults: true
})

function validate(schema, data){
    let res = ajv.validate(schema, data)
    if(!res){
        this.throw(422, ajv.errors[0].message, data)
    }
    return res
}

module.exports = function(){
    return async function(ctx, next){
        ctx.validate = validate.bind(ctx)
        await next()
    }
}