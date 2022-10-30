const express = require('express');
const app = express();
const utf8 = require('utf8');
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const fs = require('fs');
const busboy = require('connect-busboy');
const mime = require('mime');
const  { Poppler }  =  require ( "node-poppler" ) ;

//for pdfJs---------------------------------------------------------
// const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
// const util = require("util");
// const stream = require("stream");
// const CMAP_URL = "../../node_modules/pdfjs-dist/cmaps/";
// const CMAP_PACKED = true;
//------------------------------------------------------------------

const fsp = require('fs').promises;
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

// const oneHour = 1000 * 60 * 60;
const port = 5555;
const cookieStore = []

app.use(busboy());
app.use(cookieParser('govnobliat'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/static"));
app.use("/admin", express.static(__dirname + "/admin"));
app.use((req, res, next) => {
    console.log(req.cookies.to);
    // console.log(cookieStore);
    if(!sessionHave(req)){
        let cookieId = Date.now().toString()
        res.cookie('to', cookieId)
        let user = {
            cookie: cookieId,
            orders: []
        }
        cookieStore.push(user)
        res.send(cookieId)
    }
    next();
})

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
        let idForFile = Date.now().toString()
        let folder1 = __dirname + `/files/${req.cookies.to}/${idForFile}`
        try {
            if (!fs.existsSync(folder1)){
                fs.mkdirSync(folder1)
            }
        } catch (err) {
            console.error(err)
        }

        let filePath = path.join(__dirname + `/files/${req.cookies.to}/${idForFile}/${filenameToNorm}`);
        fstream = fs.createWriteStream(filePath);
        file.pipe(fstream);
        fstream.on('close', function () {
            try {
                processing(filePath, req.cookies.to, filenameToNorm, res, idForFile)
            } catch (e) {
                console.log(e);
                res.send(e)
            }
        });
    });
});

app.get("/files*", function (req, res) {
    let urll = req.url;
    console.log(urll);
    sendRes(urll, getContentType(urll), res)
});
app.post("/orders", function (req, res) {
    if(req.cookies.to){
        cookieStore.forEach(e => {
            if(e.cookie === req.cookies.to){
                let order = {
                    id: Date.now().toString(),
                    name : "БЕЗ ФАЙЛУ",
                    format: "A4",
                    countInFile: 1
                }
                e.orders.push(order)
                res.send(JSON.stringify(order))
            }
        })
    }
});
app.get("/orders", function (req, res) {
    if(req.cookies.to){
        cookieStore.forEach(e => {
            if(e.cookie === req.cookies.to){
                res.send(JSON.stringify(e))
            }
        })
    }
});
app.listen(port)
app.delete("/orders", function (req, res) {
    let body = [];
    try {
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body)
            if(req.cookies.to){
                cookieStore.forEach(c => {
                    if(c.cookie === req.cookies.to){
                        for (let i = 0; i < c.orders.length; i++){
                            if(c.orders[i].id === body.id){
                                try {
                                    filesDelete(__dirname + `/files/${c.cookie}/${c.orders[i].id}/`)
                                } catch (e) {
                                    console.log(e);
                                }
                                try {
                                    c.orders.splice(i, 1)
                                    console.log('done');
                                    res.send(body.id);
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        }
                    }
                })
            }

        })
    }
    catch (e) {
        console.log(e);
        res.send(e)
    }
});
function filesDelete(y){
    let y1 = fs.readdirSync(y);
    for(let x of y1){
        let stat = fs.statSync(y + x); // тут забыли путь
        if(!stat.isFile()){
            let path = y + x + '/';
            filesDelete(path);
        }
        else {
            fs.unlinkSync(y + x)
        }
    }
}

// app.post("/orders", function (req, res) {
//     let body = [];
//     req.on('error', (err) => {
//         console.error(err);
//     }).on('data', (chunk) => {
//         body.push(chunk);
//     }).on('end', () => {
//         body = Buffer.concat(body).toString();
//         body = JSON.parse(body)
//         if(body.do === "createNew"){
//             cookieStore.forEach(e => {
//                 if(e.cookie === req.cookies.to){
//                     let fileN = {
//                         name: "Без файлу",
//                         id: Date.now().toString()
//                     }
//                     e.orders.push(fileN)
//                     res.send(fileN)
//                 }
//             })
//         }
//     })
// });

function sendRes(url, contentType, res) {
    let file = path.join(__dirname+ url)
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

async function processing(filePath, cookies, filenameToNorm, res, id){
    console.log(mime.getType(filePath));
    if(
        mime.getType(filePath) === "image/jpeg" ||
        mime.getType(filePath) === "image/x-png" ||
        mime.getType(filePath) === "image/png"
    ){
        let folder = __dirname + `/files/${cookies}/${id}/notPdf`
        try {
            if (!fs.existsSync(folder)){
                await fs.mkdirSync(folder)
            }
        } catch (err) {
            console.error(err)
        }
        fs.createReadStream(__dirname + `/files/${cookies}/${id}/${filenameToNorm}`)
            .pipe(fs.createWriteStream(__dirname + `/files/${cookies}/${id}/notpdf/file`));

        let ress = {
            url: `/files/${cookies}/${id}/notpdf/file`,
            img: true
        }
        cookieStore.forEach(e => {
            if(e.cookie === cookies){
                let order = {
                    id: id,
                    name : filenameToNorm,
                    url: ress,
                    format: "A4",
                    countInFile: 1
                }
                e.orders.push(order)
                res.send(order)
            }
        })
    }
    if(mime.getType(filePath) === "application/pdf"){
        // toPng(filePath, cookies, filenameToNorm, res, id)
        let folder = __dirname + `/files/${cookies}/${id}/pdf`
        try {
            if (!fs.existsSync(folder)){
                await fs.mkdirSync(folder)
            }
        } catch (err) {
            console.error(err)
        }
        fs.createReadStream(__dirname + `/files/${cookies}/${id}/${filenameToNorm}`)
            .pipe(fs.createWriteStream(__dirname + `/files/${cookies}/${id}/pdf/file1.pdf`));
        let ress = {
            url: `/files/${cookies}/${id}/pdf/file1.pdf`,
        }
        cookieStore.forEach(e => {
            if(e.cookie === cookies){
                let order = {
                    id: id,
                    name : filenameToNorm,
                    url: ress,
                    format: "A4",
                    countInFile: 1
                }
                e.orders.push(order)
                res.send(order)
            }
        })


    }
    if(mime.getType(filePath) === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
        docToPdf(filePath, cookies, filenameToNorm, res, id)
    }
    if(mime.getType(filePath) === "application/msword"){
        docToPdf(filePath, cookies, filenameToNorm, res, id)
    }
    if(mime.getType(filePath) === "application/powerpoint"){
        docToPdf(filePath, cookies, filenameToNorm, res, id)
    }
    if(mime.getType(filePath) === "application/vnd.openxmlformats-officedocument.presentationml.presentation"){
        docToPdf(filePath, cookies, filenameToNorm, res, id)
    }
}

async function docToPdf(inputPath, cookies, filenameToNorm, res, id) {
    let folder = __dirname + `/files/${cookies}/${id}/pdf`
    try {
        if (!fs.existsSync(folder)){
            await fs.mkdirSync(folder)
        }
    } catch (err) {
        console.error(err)
    }
    const ext = '.pdf'
    const outputPath = __dirname + `/files/${cookies}/${id}/pdf/file1.pdf`;
    // Read file
    const docxBuf = await fsp.readFile(inputPath);
    // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
    let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
    // Here in done you have pdf file which you can save or transfer in another stream
    await fsp.writeFile(outputPath, pdfBuf);
    console.log("sucess in pdf!!!"+filenameToNorm);

    let ress = {
        url: `/files/${cookies}/${id}/pdf/file1.pdf`,
    }
    cookieStore.forEach(e => {
        if(e.cookie === cookies){
            let order = {
                id: id,
                name : filenameToNorm,
                url: ress,
                format: "A4",
                countInFile: 1
            }
            e.orders.push(order)
            res.send(order)
        }
    })

    // await toPng(outputPath, cookies, filenameToNorm, res, id)
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
        case ".jpeg":
            return "image/jpeg"
        case ".png":
            return "image/png"
        default:
            return "application/octate-stream"
    }
}

async function toPdf(outputPath, cookies, filenameToNorm, res, id) {
    // const pdfPath =
    //     process.argv[2] || outputPath;
    // const data = new Uint8Array(fs.readFileSync(pdfPath));
    //
    // let folder = __dirname + `/files/${cookies}/${id}/pdf`
    // try {
    //     if (!fs.existsSync(folder)){
    //         fs.mkdirSync(folder)
    //     }
    // } catch (err) {
    //     console.error(err)
    // }
    //
    // const outputDirectory = folder;
}

// async function toPng(outputPath, cookies, filenameToNorm, res, id) {
//     let folder = __dirname + `/files/${cookies}/${id}/png`
//     try {
//         if (!fs.existsSync(folder)){
//             fs.mkdirSync(folder)
//         }
//     } catch (err) {
//         console.error(err)
//     }
//     const file = outputPath;
//     const poppler = new Poppler();
//     const options = {
//         firstPageToConvert: 1,
//         lastPageToConvert: -1,
//         pngFile: true,
//     };
//     const outputFile = __dirname + `/files/${cookies}/${id}/png/file`;
//     const resz = await poppler.pdfToCairo(file, outputFile, options);
//     console.log(resz);
//     let readdir = fs.readdirSync(__dirname + `/files/${cookies}/${id}/png`)
//     console.log(readdir);
//     let pag = "1";
//     if(readdir.length > 9){
//         pag = "01";
//     }
//     if(readdir.length > 99){
//         pag = "001";
//     }
//     let ress = {
//         url: `${cookies}/${id}/png/`,
//         count: readdir.length,
//         pag: 0,
//         readdir: readdir,
//         ext: 2
//     }
//     cookieStore.forEach(e => {
//         if(e.cookie === cookies){
//             let order = {
//                 id: id,
//                 name : filenameToNorm,
//                 url: ress,
//                 format: "A4",
//                 countInFile: readdir.length
//             }
//             e.orders.push(order)
//             res.send(order)
//         }
//     })
// }

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