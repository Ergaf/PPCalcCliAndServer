const express = require('express');
const multer = require('multer');
const app = express();
const utf8 = require('utf8');
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const redis = require('redis');
const client = redis.createClient();
const fs = require('fs');
const busboy = require('connect-busboy');
const FormData = require('form-data');
const { Blob } = require('buffer');
const oneHour = 1000 * 60 * 60;
const port = 5555;
const cookieStore = []

app.use(busboy());
app.use(cookieParser('govnobliat'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.use(express.static(__dirname + "/files"));
app.use((req, res, next) => {
    console.log(req.cookies);
    if(!sessionHave(req)){
        let cookieId = Date.now().toString()
        res.cookie('to', cookieId)
        cookieStore.push(cookieId)
    }
    next()
})

app.post("/upload", function (req, res) {
    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        let filenameToNorm = utf8.decode(filename.filename)
        console.log("Uploading: " + filenameToNorm);
        fstream = fs.createWriteStream(__dirname + `/files/${req.cookies.to}-${filenameToNorm}`);
        file.pipe(fstream);
        fstream.on('close', function () {
            // res.header({'content-type': 'application/json'})
            res.header({'content-type': 'multipart/form-data'})
            // let response = fs.createReadStream(__dirname + `/files/${req.cookies.to}-${filenameToNorm}`);
            fs.readFile(__dirname + `/files/${req.cookies.to}-${filenameToNorm}`, (err, file) => {
                res.sed(file)
            })
        });
    });
});

app.get("/u", function (req, res) {

});
app.listen(port)

function sessionHave (req) {
    let have = false
    if(req.cookies.to){
        cookieStore.forEach(e => {
            if(e === req.cookies.to){
                have = true
            }
        })
    }
    return have;
}











// const upload = multer({ storage: storage })
// const upload1 = multer({ storage: storage }).single('file')
//
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'files')
//     },
//     filename: function (req, file, cb) {
//         cb(null, utf8.decode(file.originalname))
//     }
// })


// upload1(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//         // Случилась ошибка Multer при загрузке.
//         res.sendStatus(404)
//     } else {
//         // При загрузке произошла неизвестная ошибка.
//         // res.sendStatus(500)
//     }
//     // Загрузилось успешно
//     res.sendStatus(200)
// })