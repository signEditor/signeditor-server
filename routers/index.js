const Router = require('koa-router');

const controllers = require("../controllers")
const jwt = require("../middlewares/jwt")
 
const router = new Router({
    prefix: "/api"
});
 
router.post('/token', controllers.token.applyToken);

module.exports = app => {
    app
        .use(router.routes())
        .use(router.allowedMethods());
}