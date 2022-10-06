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
const  { Poppler }  =  require ( "node-poppler" ) ;


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
app.use((req, res, next) => {
    console.log(req.cookies);
    console.log(cookieStore);
    if(!sessionHave(req)){
        let cookieId = Date.now().toString()
        res.cookie('to', cookieId)
        let user = {
            cookie: cookieId,
            orders: []
        }
        cookieStore.push(user)
    }
    next();
})
app.use(express.static(__dirname + "/static"));

app.post("/upload", function (req, res) {
    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        let filenameToNorm = utf8.decode(filename.filename)
        console.log("Uploading: " + filenameToNorm);

        let folder = __dirname + `/files/${req.cookies.to}`
        try {
            if (!fs.existsSync(folder)){
                fs.mkdirSync(folder)
            }
        } catch (err) {
            console.error(err)
        }
        let folder1 = __dirname + `/files/${req.cookies.to}/${filenameToNorm}`
        try {
            if (!fs.existsSync(folder1)){
                fs.mkdirSync(folder1)
            }
        } catch (err) {
            console.error(err)
        }

        let filePath = path.join(__dirname + `/files/${req.cookies.to}/${filenameToNorm}/${filenameToNorm}`);
        fstream = fs.createWriteStream(filePath);
        file.pipe(fstream);
        fstream.on('close', function () {
            processing(filePath, req.cookies.to, filenameToNorm, res)
        });
    });
});

app.get("*", function (req, res) {
    let urll = req.url;
    console.log(urll);
    if(urll === "/orders"){
        if(req.cookies.to){
            cookieStore.forEach(e => {
                if(e.cookie === req.cookies.to){
                    res.send(JSON.stringify(e))
                }
            })
        }
    }
    else {
        sendRes(urll, getContentType(urll), res)
    }
});
app.listen(port)
app.delete("/orders", function (req, res) {
    console.log(req.body);
    if(req.cookies.to){
        cookieStore.forEach(c => {
            if(c.cookie === req.cookies.to){
                for (let i = 0; i < c.orders.length; i++){
                    // if(c.orders[i]._id === req.cookies.to){
                    //     cookieStore.splice(i, 1)
                    // }
                }
            }
        })
    }
});

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
            if(e.cookie === req.cookies.to){
                have = true
            }
        })
    }
    return have;
}

function processing(filePath, cookies, filenameToNorm, res){
    console.log(mime.getType(filePath));
    if(mime.getType(filePath) === "image/jpeg"){
        let ress =
            { url: `${cookies}/${filenameToNorm}/${filenameToNorm}`,
                count: 1,
                ext: 1,
                pag: 0
            }
        res.send(JSON.stringify(ress))
        cookieStore.forEach(e => {
            if(e.cookie === cookies){
                e.orders.push({
                    _name : filenameToNorm,
                    url: ress
                })
            }
        })
    }
    if(mime.getType(filePath) === "application/pdf"){
        toPng(filePath, cookies, filenameToNorm, res)
    }
    if(mime.getType(filePath) === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
        docToPdf(filePath, cookies, filenameToNorm, res)
    }
    if(mime.getType(filePath) === "application/msword"){
        docToPdf(filePath, cookies, filenameToNorm, res)
    }
}

async function docToPdf(inputPath, cookies, filenameToNorm, res) {
    let folder = __dirname + `/files/${cookies}/${filenameToNorm}/pdf`
    try {
        if (!fs.existsSync(folder)){
            await fs.mkdirSync(folder)
        }
    } catch (err) {
        console.error(err)
    }


    const ext = '.pdf'
    // const inputPath = path.join(__dirname, '/111.pptx');
    const outputPath = __dirname + `/files/${cookies}/${filenameToNorm}/pdf/${filenameToNorm}.pdf`;

    // Read file
    const docxBuf = await fsp.readFile(inputPath);

    // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
    let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);

    // Here in done you have pdf file which you can save or transfer in another stream
    await fsp.writeFile(outputPath, pdfBuf);

    console.log("sucess in pdf!!!"+filenameToNorm);

    await toPng(outputPath, cookies, filenameToNorm, res)
}

async function toPng(outputPath, cookies, filenameToNorm, res) {
    let folder = __dirname + `/files/${cookies}/${filenameToNorm}/png`
    try {
        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder)
        }
    } catch (err) {
        console.error(err)
    }


    const file = outputPath;
    const poppler = new Poppler();
    const options = {
        firstPageToConvert: 1,
        lastPageToConvert: -1,
        pngFile: true,
    };
    const outputFile = __dirname + `/files/${cookies}/${filenameToNorm}/png/file`;

    const resz = await poppler.pdfToCairo(file, outputFile, options);
    console.log(resz);

    let readdir = fs.readdirSync(__dirname + `/files/${cookies}/${filenameToNorm}/png`)
    console.log(readdir);

    let pag = "1";
    if(readdir.length > 9){
        pag = "01";
    }
    if(readdir.length > 99){
        pag = "001";
    }

    let ress =
            { url: `${cookies}/${filenameToNorm}/png/`,
                count: readdir.length,
                pag: 0,
                readdir: readdir,
                ext: 2
            }
        res.send(JSON.stringify(ress))

    cookieStore.forEach(e => {
        if(e.cookie === cookies){
            e.orders.push({
                _name : filenameToNorm,
                url: ress
            })
        }
    })

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