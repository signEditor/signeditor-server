const mongoose = require("../db/mongodb").mongoose

const DocumentSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    authorId: String,
    name: String,
    content: String,
    createtime: { type: Date, default: Date.now },
    updatetime: { type: Date, default: Date.now }
}, {
    collection: "documents"
})
DocumentSchema.index({id: 1})
DocumentSchema.index({authorId: 1})

const DeleteDocumentSchema = new mongoose.Schema({
    id: { type: String },
    authorId: String,
    name: String,
    content: String,
    createtime: { type: Date },
    updatetime: { type: Date },
    deletetime: { type: Date, default: Date.now },
}, {
    collection: "documents-delete"
})

const Document = mongoose.model("document", DocumentSchema)
const DeleteDocument = mongoose.model("document-delete", DeleteDocumentSchema)

Document.syncIndexes()

exports.Document = Document
exports.DeleteDocument = DeleteDocument