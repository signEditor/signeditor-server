const services = require("../services")
const registerSchema = {
    $id: "http://editor.signit.cn/schemas/registerSchema.json",
    type: "object",
    properties: {
        username: { type: "string" },
        password: { type: "string" },
    },
    required: [
        "username",
        "password",
    ]
}

exports.register = async function(ctx, next){
    const body = ctx.request.body
    const data = {
        username: body.username,
        password: body.password,
    }
    
    if(!ctx.validate(registerSchema, data)) return

    let user = await services.users.createUser(data.username, data.password)

    ctx.body = {
        id: user.id,
        username: user.username
    }
}