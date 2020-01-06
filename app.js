const express = require('express');
const app= express();
const bodyParser = require('body-parser')

const multer = require('multer')
const mammoth = require('mammoth')

let storage = multer.memoryStorage()
let upload = multer({ storage: storage })
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({}))
app.use(bodyParser.urlencoded({extended:false,limit: '50mb'}))
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

//存储用户数据
const userData = [{
    id: 0,
    userName: '123456',
    passWd: '123456'
}]

//根据用户id存储的用户word模板
const wordTemplateData = {
    0: [{
        id: '0',
        title: 'test',
        content: 'test'
    }]
}

//登录接口
app.post('/login', function(req, res) {
    let data = req.body.data
    let { userName, passWd } = data
    userData.forEach(item => {
        if(item.userName === userName && item.passWd === passWd) {
            res.send({
                status: 200,
                msg: '登录成功',
                code: '0000',
                data: {
                    id: item.id
                }
            })
            return
        }
    })
    res.send({
        status: 200,
        code: '1111',
        msg: '用户名或者密码错误,登录失败',
        data: {}
    })
})

//注册接口
app.post('/register', (req, res) => {
    let data = req.body.data
    let { userName, passWd } = data
    let ans = userData.some(item => {
        //如果出现用户重名
        return item.userName === userName
    })
    if(ans) {
        res.send({
            status: 200,
            code: '1111',
            msg: '用户存在重名,请重新输入',
            data: {}
        })
    } else {
        //插入数据
        let len = userData.length
        userData.push({
            id: len,
            userName,
            passWd
        })
        wordTemplateData[len] = []
        //返回注册成功
        res.send({
            status: 200,
            code: '0000',
            msg: '注册成功',
            data: {
                id: len
            }
        })
    }
})


//获取用户的文档模板
app.get('/getUserTemplate', (req, res) => {
    let userID = req.query.userID
    //如果用户数据存在
    if(wordTemplateData[userID]) {
        res.send({
            status: 200,
            msg: '获取数据成功',
            code: '0000',
            data: {
                wordTemplateData: wordTemplateData[userID]
            }
        })
    } else {
        res.send({
            status: 200,
            msg: '或许数据失败',
            code: '1111',
            data: {}
        })
    }
})


//获取用户的文档数据
app.get('/getUserWordInfo', (req, res) => {
    let { userID, wordID } = req.query
    if(wordTemplateData[userID]) {
        if(wordTemplateData[userID][wordID]) {
            res.send({
                status: 200,
                msg: '获取数据成功',
                code: '0000',
                data: wordTemplateData[userID][wordID]
            })
        } else {
            let len = wordTemplateData[userID].length
            wordTemplateData[userID].push({
                id: len,
                title: '',
                content: ''
            })
            res.send({
                status: 200,
                msg: '添加数据成功',
                code: '0000',
                data: wordTemplateData[userID][wordID]
            })
        }
    } else {
        res.send({
            status: 200,
            msg: '获取数据失败',
            code: '0000',
            data: ''
        })
    }
})


app.post('/saveUserWordInfo', (req, res) => {
    let data = req.body.data
    let { userID, title, content, id } = data
    if(userID && title && content && id) {
        wordTemplateData[userID][id] = {
            id,
            title,
            content
        }
        res.send({
            status: 200,
            msg: '保存成功',
            code: '0000'
        })
    } else {
        res.send({
            status: 200,
            msg: '保存失败',
            code: '1111'
        })
    }
})


app.post('/upLoadWord', upload.single("file"), (req, res) => {
    let file = req.file
    let title = file.originalname
    mammoth.convertToHtml({buffer: file.buffer})
    .then(result => {
        res.send({
            status: 200,
            data: result,
            title
        })
    })
    .done(err => {
        
    });
})

app.listen(5000, ()=>{
    console.log('http://127.0.0.1:5000')
}) 