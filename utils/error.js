class ServerError extends Error{
    constructor(code, message = "error", status = 500){
        super()

        this.code = code //1错误以1开头 000模块号 000接口号 000接口错误号
        this.status = status
        this.message = message
    }
}

exports.ServerError = ServerError