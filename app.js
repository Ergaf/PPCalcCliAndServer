const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    redisStorage = require('connect-redis')(session),
    redis = require('redis'),
    client = redis.createClient()
const multer = require('multer');
const fs = require('fs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(
//     session({
//         // store: new redisStorage({
//         //     // host: host,
//         //     // port: 6379,
//         //     client: client,
//         // }),
//         secret: 'you secret key',
//         saveUninitialized: true,
//     })
// )

let port = 5555
//зачем-то юзают библиотеку, ну ок-----------------------------------------------------------------
const storage = multer.diskStorage({
    //Надо еще добавить проверку на является ли файл картинкой.
    destination: function (req, file, cb) {
        cb(null, __dirname + '/files') //Здесь указывается путь для сохранения файлов
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });
//-------------------------------------------------------------------------------------------------
// app.post('/upload', upload.any(), function(req, res){
//     console.log("req = ", req.files);
//     res.send(req.files);
// });

app.post('/upload', upload.single('uploaded_file'), function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any
    console.log(req.file, req.body)
    // res.send(req.body);
});

app.get('files/:path([\\w\\W]+)', (req, res) => {
    const { params: { path } } = req
    fs.readFile(path, (err, data) => {
        // Здесь можно работать с файлом
    })
})

// app.get('/', (req, res) => {
//     console.log(req.session.key[req.sessionID].showAd)
//     res.sendStatus(200)
// })

app.use("/", express.static(__dirname + "/static"));

app.listen(port, () => console.log("listen "+port))