const Ajv = require("ajv")
const ajv = new Ajv({
    useDefaults: true
})

const applyTokenRequestSchema = {
    $id: "http://editor.signit.cn/schemas/applyTokenRequestSchema.json",
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

const services = require("../services")


exports.applyToken = async function(ctx, next){
    const body = ctx.request.body
    const data = {
        username: body.username,
        password: body.password,
    }
    
    if(!ctx.validate(applyTokenRequestSchema, data)) return

    let token = await services.token.applyToken(data.username, data.password)

    ctx.body = {
        token
    }
}