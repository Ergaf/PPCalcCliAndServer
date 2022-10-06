const express = require('express');
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
const mime = require('mime');
const pdf2img = require('pdf-img-convert');


const fsp = require('fs').promises;
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

const oneHour = 1000 * 60 * 60;
const port = 5555;
const cookieStore = []

app.use(busboy());
app.use(cookieParser('govnobliat'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
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

        let filePath = path.join(__dirname + `/files/${req.cookies.to}-${filenameToNorm}`);
        fstream = fs.createWriteStream(filePath);
        file.pipe(fstream);
        fstream.on('close', function () {
            processing(filePath, req.cookies.to, filenameToNorm, res)
        });
    });
});

app.get("/getImg/*", function (req, res) {
    console.log(req.url);

    sendRes(req.url, getContentType(req.url), res)
});
app.listen(port)

function sendRes(url, contentType, res) {
    let file = path.join(__dirname+"/files/", url)
    fs.readFile(file, (err, content) => {
        if(err){
            res.writeHead(404)
            res.write("file not found")
            res.end();
            console.log("file not found "+file);
        }
        else {
            res.writeHead(200, {"Content-Type": contentType})
            res.write(content)
            res.end();
            console.log("sucess! "+file);
        }
    })
}

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

function processing(filePath, cookies, filenameToNorm, res){
    console.log(mime.getType(filePath));
    if(mime.getType(filePath) === "image/jpeg"){
        let oldPath = filePath
        let newPath = __dirname + `/files/getImg/${cookies}-${filenameToNorm}`
        fs.rename(oldPath, newPath, function (err) {
            if (err) {throw err}
            console.log('Successfully renamed - AKA moved!')
            let ress =
                { url: cookies+"-"+filenameToNorm,
                    count: 1,
                    ext: "none",
                    pag: 0
                }
            res.send(JSON.stringify(ress))
        })
    }
    if(mime.getType(filePath) === "application/pdf"){

    }
    if(mime.getType(filePath) === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
        docToPdf(filePath, cookies, filenameToNorm, res)
    }
}

async function docToPdf(inputPath, cookies, filenameToNorm, res) {
    const ext = '.pdf'
    // const inputPath = path.join(__dirname, '/111.pptx');
    const outputPath = __dirname + `/files/pdf/${cookies}-${filenameToNorm}.pdf`;

    // Read file
    const docxBuf = await fsp.readFile(inputPath);

    // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
    let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);

    // Here in done you have pdf file which you can save or transfer in another stream
    await fsp.writeFile(outputPath, pdfBuf);

    console.log("sucess in pdf!!!"+filenameToNorm);

    let outputImages1 = pdf2img.convert(outputPath);
    let listCount = 0;
    outputImages1.then(function(outputImages) {
        for (i = 0; i < outputImages.length; i++) {
            fs.writeFile(__dirname + `/files/getImg/${cookies}-${filenameToNorm}-${i}.jpeg`, outputImages[i], function (error) {
                if (error) {
                    console.error("Error: " + error);
                }
            });
            console.log(`${cookies}-${filenameToNorm}-${i}.jpeg`);
            listCount++
        }
        let ress =
            { url: cookies+"-"+filenameToNorm+"-",
                count: listCount,
                pag: 0,
                ext: ".jpeg"
            }
        res.send(JSON.stringify(ress))
    });
}

function getContentType(url) {
    switch (path.extname(url)){
        case ".html":
            return "text/html"
        case ".css":
            return "text/css"
        case ".js":
            return "text/javascript"
        case ".json":
            return "application/json"
        case ".jpg":
            return "image/jpeg"
        default:
            return "application/octate-stream"
    }
}



// app.post("/upload", function (req, res) {
//     let fstream;
//     req.pipe(req.busboy);
//     req.busboy.on('file', function (fieldname, file, filename) {
//         let filenameToNorm = utf8.decode(filename.filename)
//         console.log("Uploading: " + filenameToNorm);
//         fstream = fs.createWriteStream(__dirname + `/files/${req.cookies.to}-${filenameToNorm}`);
//         file.pipe(fstream);
//         fstream.on('close', function () {
//             // res.header({'content-type': 'application/json'})
//             res.header({'content-type': 'multipart/form-data'})
//             // let response = fs.createReadStream(__dirname + `/files/${req.cookies.to}-${filenameToNorm}`);
//             fs.readFile(__dirname + `/files/${req.cookies.to}-${filenameToNorm}`, (err, file) => {
//                 res.send("1")
//             })
//         });
//     });
// });