const path = require("path")
process.env["NODE_CONFIG_DIR"] = path.resolve(__dirname, "./configs")

const Koa = require('koa')
const app = new Koa()

app.use(require("./middlewares/error")())
app.use(require("./middlewares/validation")())
app.use(require("koa-body")())
require("./routers")(app)

app.listen(3000);