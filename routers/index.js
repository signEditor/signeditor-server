const Router = require('koa-router');

const controllers = require("../controllers")
const jwt = require("../middlewares/jwt")
 
const router = new Router({
    prefix: "/api"
});
 
router.post('/token', controllers.token.applyToken)

router.post('/users', controllers.users.register)


router.get('/documents', jwt(), controllers.documents.queryDocuments)
router.post('/documents', jwt(), controllers.documents.createDocument)
router.get('/documents/:docId', jwt(), controllers.documents.queryDocumentDetail)
router.put('/documents/:docId', jwt(), controllers.documents.updateDocument)
router.delete('/documents/:docId', jwt(), controllers.documents.deleteDocument)

module.exports = app => {
    app
        .use(router.routes())
        .use(router.allowedMethods());
}