const uuidv4 = require("uuid/v4")
const { Document, DeleteDocument } = require("../models/document")
const ServerError = require("../utils/error").ServerError

//生成文档ID
async function generateDocId(){
    let id = uuidv4()
    let existDoc
    do{
        existDoc = await Document.findOne({id})
    } while(existDoc)
    return id
}

//创建信封
async function createDocument(authorId, name, content){
    let doc = new Document({
        id: await generateDocId(),
        authorId,
        name,
        content
    })
    await doc.save()
    return doc
}
exports.createDocument = createDocument

//查询文档
async function userQueryDocuments(authorId, offset = 0, limit = 10, sort = "createtime"){
    let docs = await Document.find({
        authorId
    }).sort(sort).skip(offset).limit(limit)
    return docs
}
exports.userQueryDocuments = userQueryDocuments


//更新文档
class DocNotExistError extends ServerError{constructor(){super(1003003001, "文档不存在", 400)}}
class UserNotAuthorDocError extends ServerError{constructor(){super(1003003002, "当前用户不是该文档的拥有者", 403)}}
async function userUpdateDocument(userId, docId, name, content){
    let doc = await Document.findOne({
        id: docId
    })

    if(!doc) throw new DocNotExistError()
    if(doc.authorId !== userId) throw new UserNotAuthorDocError()

    if(name != undefined) doc.name = name
    if(content != undefined) doc.content = content
    doc.updatetime = Date.now()
    await doc.save()

    return doc
}
exports.userUpdateDocument = userUpdateDocument

//删除文档
async function userDeleteDocument(userId, docId){
    let doc = await Document.findOne({
        id: docId
    })

    if(!doc) throw new DocNotExistError()
    if(doc.authorId !== userId) throw new UserNotAuthorDocError()

    let delDoc = new DeleteDocument({
        id: doc.id,
        authorId: doc.authorId,
        name: doc.name,
        content: doc.content,
        createtime: doc.createtime,
        updatetime: doc.updatetime,
    })

    await delDoc.save()
    await doc.remove()
    return doc
}
exports.userDeleteDocument = userDeleteDocument

//查询文档详细
async function queryUserDocumentDetail(userId, docId){
    let doc = await Document.findOne({
        id: docId
    })

    if(!doc) throw new DocNotExistError()
    if(doc.authorId !== userId) throw new UserNotAuthorDocError()

    return doc
}
exports.queryUserDocumentDetail = queryUserDocumentDetail

//查询文档数目
async function userDocumentsCount(userId){
    return Document.count({
        authorId: userId
    })
}
exports.userDocumentsCount = userDocumentsCount
