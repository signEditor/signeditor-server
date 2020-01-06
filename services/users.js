const uuidv4 = require("uuid/v4")
const User = require("../models/user")
const crtpyo = require("crypto")
const ServerError = require("../utils/error").ServerError

function randomSalt(){
    return crtpyo.createHash("SHA3-256").update(uuidv4()).digest("hex")
}

function passwordCompose(basePassword, salt){
    return `${salt}${basePassword}${salt}`
}

function buildPasswordWithSalt(basePassword, salt){
    return crtpyo.createHash("SHA3-256").update(passwordCompose(basePassword, salt)).digest("hex")
}

function verifyPassword(basePassword, salt, password){
    return buildPasswordWithSalt(basePassword, salt) === password
}

//生成用户ID
async function generateUserId(){
    let id = uuidv4()
    let existUser
    do{
        existUser = await User.findOne({
            id
        })
    } while(existUser)
    return id
}


class UserExistError extends ServerError{constructor(){super(1001001001, "用户已存在", 400)}}
async function createUser(username, password){
    //检测是否存在同名用户
    let existUser = await User.findOne({
        username
    })
    
    if(existUser){
        throw new UserExistError()
    }

    let salt = randomSalt()
    let endpassword = buildPasswordWithSalt(password, salt)

    let user = new User({
        id: await generateUserId(),
        username,
        password: endpassword,
        passwordSalt: salt
    })
    
    await user.save()
    return user
}
createUser.UserExistError = UserExistError
exports.createUser = createUser

class UserNotExistError extends ServerError{constructor(){super(1001002001, "用户不存在", 400)}}
exports.checkPassword = async function(username, password){
    let existUser = await User.findOne({
        username
    })

    if(!existUser){
        throw new UserNotExistError()
    }

    if(verifyPassword(password, existUser.passwordSalt, existUser.password)){
        return existUser
    }

    return null
}