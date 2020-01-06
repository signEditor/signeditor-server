const mongoose = require('mongoose')

var mongoose2 = new mongoose.Mongoose()
mongoose2.connect('mongodb://root:root@10.10.9.172:27017/editor-db?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true })

exports.mongoose = mongoose2