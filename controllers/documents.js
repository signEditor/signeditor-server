const services = require("../services")




const createDocumentSchema = {
    $id: "http://editor.signit.cn/schemas/createDocumentSchema.json",
    type: "object",
    properties: {
        userId: { type: "string" },
        name: { type: "string", default: "未命名" },
        content: { type: "string", default: "" },
    },
    required:[
        "userId"
    ]
}
exports.createDocument = async function(ctx, next){
    const body = ctx.request.body
    const data = {
        userId: ctx.jwtpayload.uid,
        name: body.name,
        content: body.content,
    }
    if(!ctx.validate(createDocumentSchema, data)) return

    let doc = await services.documents.createDocument(data.userId, data.name, data.content)

    ctx.body = {
        docId: doc.id,
        name: doc.name
    }
}

const queryDocumentSchema = {
    $id: "http://editor.signit.cn/schemas/queryDocumentSchema.json",
    type: "object",
    properties: {
        userId: { type: "string" },
        offset: { type: "number", default: 0 },
        limit: { type: "number", default: 10 },
        sort: { type: "string", default: "-createtime" },
    },
    required:[
        "userId"
    ]
}
exports.queryDocuments = async function(ctx, next){
    const query = ctx.query
    const data = {
        userId: ctx.jwtpayload.uid,
        offset: parseInt(query.offset),
        limit: parseInt(query.limit),
        sort: query.sort,
    }

    if(!ctx.validate(queryDocumentSchema, data)) return
    let docs = await services.documents.userQueryDocuments(data.userId, data.offset, data.limit, data.sort)

    ctx.body = {
        docs: docs.map(doc => {
            return {
                id: doc.id,
                name: doc.name,
                authorId: doc.authorId,
                createtime: doc.createtime.getTime(),
                updatetime: doc.updatetime.getTime(),
            }
        }),
        docsCount: await services.documents.userDocumentsCount(data.userId)
    }
}

const queryDocumentDetailSchema = {
    $id: "http://editor.signit.cn/schemas/queryDocumentDetailSchema.json",
    type: "object",
    properties: {
        userId: { type: "string" },
        docId: { type: "string"},
    },
    required:[
        "userId",
        "docId"
    ]
}
exports.queryDocumentDetail = async function(ctx, next){
    const data = {
        userId: ctx.jwtpayload.uid,
        docId: ctx.params.docId,
    }

    if(!ctx.validate(queryDocumentDetailSchema, data)) return
    let doc = await services.documents.queryUserDocumentDetail(data.userId, data.docId)

    ctx.body = {
        doc: {
            id: doc.id,
            authorId: doc.authorId,
            name: doc.name,
            content: doc.content,
            createtime: doc.createtime.getTime(),
            updatetime: doc.updatetime.getTime(),
        }
    }
}

const updateDocumentSchema = {
    $id: "http://editor.signit.cn/schemas/updateDocumentSchema.json",
    type: "object",
    properties: {
        userId: { type: "string" },
        docId: { type: "string"},
        name: { type: "string"},
        content: { type: "string"},
    },
    required:[
        "userId",
        "docId"
    ]
}
exports.updateDocument = async function(ctx, next){
    const data = {
        userId: ctx.jwtpayload.uid,
        docId: ctx.params.docId,
        name: ctx.request.body.name,
        content: ctx.request.body.content,
    }

    if(!ctx.validate(updateDocumentSchema, data)) return
    let doc = await services.documents.userUpdateDocument(data.userId, data.docId, data.name, data.content)

    ctx.body = {
        doc: {
            id: doc.id,
        }
    }
}

const deleteDocumentSchema = {
    $id: "http://editor.signit.cn/schemas/deleteDocumentSchema.json",
    type: "object",
    properties: {
        userId: { type: "string" },
        docId: { type: "string"},
    },
    required:[
        "userId",
        "docId"
    ]
}
exports.deleteDocument = async function(ctx, next){
    const data = {
        userId: ctx.jwtpayload.uid,
        docId: ctx.params.docId,
    }

    if(!ctx.validate(deleteDocumentSchema, data)) return
    let doc = await services.documents.userDeleteDocument(data.userId, data.docId)

    ctx.body = {
        doc: {
            id: doc.id,
        }
    }
}