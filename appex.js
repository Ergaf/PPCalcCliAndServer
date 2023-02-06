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
const readXlsxFile = require('read-excel-file/node');
const fsEx = require('fs-extra');

const { decode } = require("decode-tiff");
const { PNG } = require("pngjs");

const mysql = require("mysql2");
const configSQLConnection = {
    host: "localhost",
    user: "root",
    database: "calc",
    password: "1234"
}
// let connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     database: "calc",
//     password: "1234"
// });

// const user = ["Tom", 29];
// const sql = "INSERT INTO users(name, age) VALUES(?, ?)";

// connection.query(sql, user, function(err, results) {
//     if(err) console.log(err);
//     else console.log("Данные добавлены");
// });

// connection.query("SELECT * FROM users",
//     function(err, results, fields) {
//         console.log(err);
//         console.log(results); // собственно данные
//         // console.log(fields); // мета-данные полей
//     });
// connection.end();


let tableMain;
readXlsxFile(fs.createReadStream(__dirname + "/data/tableMain.xlsx")).then((rows) => {
    tableMain = rows
    console.log("tableMain reading close with no err");
    // `rows` is an array of rows
    // each row being an array of cells.
})

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
app.use((req, res, next) => {
    // console.log(req.cookies.to);
    let connection = mysql.createConnection(configSQLConnection);
    let data = "0"
    if(!req.cookies.to){
        let cookieId = Date.now().toString()
        res.cookie('to', cookieId)
        data = cookieId
        // next();
    } else {
        data = [req.cookies.to]
    }
    let sql = "SELECT * from sessies WHERE sessie = ?";
    connection.query(sql, data, function(err, results, fields) {
            if(err) {
                console.log(err);
            }
            if(results.length > 0){
                // console.log(results[0].sessie); // собственно данные
            }
            if(results.length === 0){
                let cookieId = Date.now().toString()
                res.cookie('to', cookieId)

                let session = [cookieId, req.header('user-agent'), req.ip, 0];

                let sql = "INSERT INTO sessies(sessie, userAgent, ip, userid) VALUES(?, ?, ?, ?)";

                let connection = mysql.createConnection(configSQLConnection);
                connection.query(sql, session, function(err, results) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log("Данные добавлены");
                        next();
                    }
                });
                connection.end();
            }
            else {
                connection.end();
                next();
            }
        });
})
// app.use((req, res, next) => {
//     console.log(req.cookies.to);
//
//     if(!sessionHave(req)){
//         let cookieId = Date.now().toString()
//         res.cookie('to', cookieId)
//         let user = {
//             cookie: cookieId,
//             orders: [],
//             photoOrders: [],
//             activeOrders: []
//         }
//         cookieStore.push(user)
//         next();
//     }
//     else {
//         next();
//     }
// })
app.use("/login", express.static(__dirname + "/admin/login"));
app.use("/admin", express.static(__dirname + "/admin/admin"));
app.use("/3dtest", express.static(__dirname + "/admin/3dtest"));
app.use("/red", express.static(__dirname + "/admin/image-editor/examples"));

app.post("/uploadFile", function (req, res) {
    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        let filenameToNorm = utf8.decode(filename.filename)
        console.log("Uploading file: " + filenameToNorm);

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
                processing(filePath, req.cookies.to, filenameToNorm, res, idForFile, fieldname)
            } catch (e) {
                console.log(e.message);
                res.send(e)
            }
        });
    });
});

app.post("/uploadRedactedFile", function (req, res) {
    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (idForFile, file, filename) {
        let folder1 = __dirname + `/files/${req.cookies.to}/${idForFile}/red`
        try {
            if (!fs.existsSync(folder1)){
                fs.mkdirSync(folder1)
            }
        } catch (err) {
            console.error(err)
        }
        let filePath = path.join(__dirname + `/files/${req.cookies.to}/${idForFile}/red/file`);
        fstream = fs.createWriteStream(filePath);
        file.pipe(fstream);
        fstream.on('close', function () {
            console.log(`cookie : ${req.cookies.to}, Uploading redacted file: ${idForFile}`);
            if(req.cookies.to) {
                cookieStore.forEach(e => {
                    if (e.cookie === req.cookies.to) {
                        e.orders.forEach(o => {
                            if(o.id === idForFile){
                                o.url.url = `/files/${req.cookies.to}/${idForFile}/red/file`;
                                res.send(`/files/${req.cookies.to}/${idForFile}/red/file`);
                            }
                        })
                    }
                })
            }
        });
    });
});

//photoFiles ---------------------------------------------------------------------------
// app.post("/uploadAllPhotoPrev", function (req, res) {
//     let idForFile = Date.now().toString()
//     let folder1 = __dirname + `/files/${req.cookies.to}`
//     try {
//         if (!fs.existsSync(folder1)){
//             fs.mkdirSync(folder1)
//         }
//     } catch (err) {
//         console.error(err)
//     }
//
//     if(req.cookies.to){
//         cookieStore.forEach(e => {
//             if(e.cookie === req.cookies.to){
//                 e.photoOrders.push()
//             }
//         })
//     }
//     res.send(idForFile)
// })
// app.post("/uploadAllPhoto", function (req, res) {
//     let fstream;
//     req.pipe(req.busboy);
//     req.busboy.on('file', function (fieldname, file, filename) {
//         let filenameToNorm = utf8.decode(filename.filename)
//         console.log("Uploading file: " + filenameToNorm);
//
//         let folder = __dirname + `/files/${req.cookies.to}`
//         try {
//             if (!fs.existsSync(folder)){
//                 fs.mkdirSync(folder)
//             }
//         } catch (err) {
//             console.error(err)
//         }
//         let idForFile = Date.now().toString()
//         let folder1 = __dirname + `/files/${req.cookies.to}/${idForFile}`
//         try {
//             if (!fs.existsSync(folder1)){
//                 fs.mkdirSync(folder1)
//             }
//         } catch (err) {
//             console.error(err)
//         }
//
//         let filePath = path.join(__dirname + `/files/${req.cookies.to}/${idForFile}/${filenameToNorm}`);
//         fstream = fs.createWriteStream(filePath);
//         file.pipe(fstream);
//         fstream.on('close', function () {
//             try {
//                 processing(filePath, req.cookies.to, filenameToNorm, res, idForFile, fieldname)
//             } catch (e) {
//                 console.log(e.message);
//                 res.send(e)
//             }
//         });
//     });
// })
//----------------------------------------------------------------------------------------

app.get("/parameterCalc", function (req, res) {

    let calc = req.query.calc;
    let paper = req.query.paper;
    let destiny = req.query.destiny;

    if(req.cookies.to){
        cookieStore.forEach(e => {
            if(e.cookie === req.cookies.to){
                let calcTypeFormat = "custom";
                if(calc === "digital"){
                    calcTypeFormat = "A4"
                }
                if(calc === "wide"){
                    calcTypeFormat = "A1"
                }
                if(calc === "photo"){
                    calcTypeFormat = "A4"
                }
                let ress = {
                    url: "/files/totest/file-1.png",
                    img: true,
                    red: false
                }
                let order = {
                    calc: calc,
                    id: Date.now().toString(),
                    name : `БЕЗ ФАЙЛУ ${calc}`,
                    format: calcTypeFormat,
                    countInFile: 1,
                    url: ress,
                    paper: paper,
                    destiny: destiny
                }
                e.orders.push(order)

                res.redirect("/")
                // res.send(JSON.stringify(order))
            }
        })
    }
});

app.get("/files*", function (req, res) {
    let urll = req.url;
    // console.log(`a request came for a file to url ${urll}`);
    sendRes(urll, getContentType(urll), res)
});
app.post("/orders", function (req, res) {
    let body = [];
    try {
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body)
            console.log(`add order without file, calc type: ${body.data.calc}`);

            let connection = mysql.createConnection(configSQLConnection);
            let data = [body.data.calc, "БЕЗ ФАЙЛУ "+body.data.calc, `0`, req.cookies.to, 1, 0];
            let sql = "INSERT INTO files(calc, name, path, session, img, red) VALUES(?, ?, ?, ?, ?, ?)";
            connection.query(sql, data, function(err, results, fields){
                if(err) {
                    console.log(err);
                }
                else {
                    // console.log(results);
                    let ress = {
                        url: "0",
                        img: true,
                        red: false
                    }
                    let order = {
                        calc: body.data.calc,
                        id: results.insertId,
                        name : `БЕЗ ФАЙЛУ ${body.data.calc}`,
                        countInFile: 1,
                        url: ress
                    }

                    res.send(order)
                }
            })
            connection.end();

            // if(req.cookies.to){
            //     cookieStore.forEach(e => {
            //         if(e.cookie === req.cookies.to){
            //             let calcTypeFormat = "custom";
            //             if(body.data.calc === "digital"){
            //                 calcTypeFormat = "A4"
            //             }
            //             if(body.data.calc === "wide"){
            //                 calcTypeFormat = "A1"
            //             }
            //             if(body.data.calc === "photo"){
            //                 calcTypeFormat = "A4"
            //             }
            //             let ress = {
            //                 url: "/files/totest/file-1.png",
            //                 img: true,
            //                 red: false
            //             }
            //             let order = {
            //                 calc: body.data.calc,
            //                 id: Date.now().toString(),
            //                 name : `БЕЗ ФАЙЛУ ${body.data.calc}`,
            //                 format: calcTypeFormat,
            //                 countInFile: 1,
            //                 url: ress
            //             }
            //             e.orders.push(order)
            //             res.send(JSON.stringify(order))
            //         }
            //     })
            // }
        })
    }catch (e) {
        console.log(e.message);
    }
});
app.get("/orders", function (req, res) {
    // if(req.cookies.to){
    //     cookieStore.forEach(e => {
    //         if(e.cookie === req.cookies.to){
    //             res.send(JSON.stringify(e))
    //         }
    //     })
    // }
    let connection = mysql.createConnection(configSQLConnection);
    let data = [req.cookies.to];
    let sql = "SELECT * from files WHERE session = ?";
    connection.query(sql, data, function(err, results, fields){
        if(err) {
            console.log(err);
        }
        else {
            // console.log(results);
            let files = [];
            if(results.length > 0){
                results.forEach(e => {
                    let ress = {
                        url: e.path,
                        img: e.img,
                        red: e.red
                    }
                    let order = {
                        calc: e.calc,
                        id: e.id,
                        name : e.name,
                        countInFile: 1,
                        url: ress
                    }
                    files.push(order)
                })
            }

            res.send(files)
        }
    })
    connection.end();
});
app.listen(port, function () {
    console.log(`server on port ${port}`);
})
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

            let connection = mysql.createConnection(configSQLConnection);
            let data = [body.id];
            let sql = "DELETE from files WHERE id = ?";
            connection.query(sql, data, function(err, results, fields){
                if(err) {
                    console.log(err);
                }
                else {
                    console.log("delete file id "+data[0]);
                    try {
                        filesDelete(__dirname + `/files/${req.cookies.to}/${data[0]}/`)
                    } catch (e) {
                        console.log(e.message);
                    }
                    res.send(JSON.stringify(data[0]))
                }
            })
            connection.end();



            // if(req.cookies.to){
            //     cookieStore.forEach(c => {
            //         if(c.cookie === req.cookies.to){
            //             for (let i = 0; i < c.orders.length; i++){
            //                 if(c.orders[i].id === body.id){
            //                     try {
            //                         filesDelete(__dirname + `/files/${c.cookie}/${c.orders[i].id}/`)
            //
            //
            //                         // fs.remove(__dirname + `/files/${c.cookie}/${c.orders[i].id}`).then(() => {
            //                         //     //готово
            //                         // }).catch(err => {
            //                         //     console.error(err)
            //                         // })
            //
            //                     } catch (e) {
            //                         console.log(e.message);
            //                     }
            //                     try {
            //                         let order = c.orders[i]
            //                         c.orders.splice(i, 1)
            //                         console.log(`delete ${order.name} done`);
            //                         res.send(body.id);
            //                     } catch (e) {
            //                         console.log(e.message);
            //                         res.send(e.message);
            //                     }
            //                 }
            //             }
            //         }
            //     })
            // }

        })
    }
    catch (e) {
        console.log(e.message);
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

async function sessionHave (req) {
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

async function sqlTransaction(sql, data) {
    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "calc",
        password: "1234"
    });

    connection.query(sql, data,
        function(err, results, fields) {
            console.log(err);
            console.log(results); // собственно данные
            return results;
            // console.log(fields); // мета-данные полей
        });
    connection.end();
}

async function processing(filePath, cookies, filenameToNorm, res, id, calcType){
    console.log(`uploading file mime type: ${mime.getType(filePath)}, calcType: ${calcType}`);
    if(
        mime.getType(filePath) === "image/x-jpeg" ||
        mime.getType(filePath) === "image/jpeg" ||
        mime.getType(filePath) === "image/x-png" ||
        mime.getType(filePath) === "image/png" ||
        mime.getType(filePath) === "image/x-jpg"||
        mime.getType(filePath) === "image/jpg"
    ){
        let folder = __dirname + `/files/${cookies}/${id}/notPdf`
        try {
            if (!fs.existsSync(folder)){
                await fs.mkdirSync(folder)
            }
        } catch (err) {
            console.error(err.message)
        }
        fs.createReadStream(__dirname + `/files/${cookies}/${id}/${filenameToNorm}`)
            .pipe(fs.createWriteStream(__dirname + `/files/${cookies}/${id}/notpdf/file`));

        let ress = {
            urlOriginal: `/files/${cookies}/${id}/notpdf/file`,
            url: `/files/${cookies}/${id}/notpdf/file`,
            img: true,
            red: true
        }
        cookieStore.forEach(e => {
            if(e.cookie === cookies){
                let order = {
                    calc: calcType,
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
    else if(mime.getType(filePath) === "application/pdf"){
        // toPng(filePath, cookies, filenameToNorm, res, id)
        let folder = __dirname + `/files/${cookies}/${id}/pdf`
        try {
            if (!fs.existsSync(folder)){
                await fs.mkdirSync(folder)
            }
        } catch (err) {
            console.error(err.message)
        }
        fs.createReadStream(__dirname + `/files/${cookies}/${id}/${filenameToNorm}`)
            .pipe(fs.createWriteStream(__dirname + `/files/${cookies}/${id}/pdf/file1.pdf`));

        // getInfoInPdf(filePath, cookies, filenameToNorm, res, id, __dirname + `/files/${cookies}/${id}/pdf/file1.pdf`)
        let ress = {
            url: `/files/${cookies}/${id}/pdf/file1.pdf`,
        }
        cookieStore.forEach(e => {
            if(e.cookie === cookies){
                let order = {
                    calc: calcType,
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
    else if(mime.getType(filePath) === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
        docToPdf(filePath, cookies, filenameToNorm, res, id, calcType)
    }
    else if(mime.getType(filePath) === "application/msword"){
        docToPdf(filePath, cookies, filenameToNorm, res, id, calcType)
    }
    else if(mime.getType(filePath) === "application/powerpoint"){
        docToPdf(filePath, cookies, filenameToNorm, res, id, calcType)
    }
    else if(mime.getType(filePath) === "application/vnd.openxmlformats-officedocument.presentationml.presentation"){
        docToPdf(filePath, cookies, filenameToNorm, res, id, calcType)
    }
    // else if(mime.getType(filePath) === "image/tiff"){
    //     tiffToPng(filePath, cookies, filenameToNorm, res, id, calcType)
    // }
    else {
        let ress = {
            url: `/files/totest/errorNoFormat.png`,
            img: true
        }
        cookieStore.forEach(e => {
            if(e.cookie === cookies){
                let order = {
                    calc: calcType,
                    id: id,
                    name : filenameToNorm,
                    url: ress,
                    format: "A4",
                    countInFile: 1
                }
                e.orders.push(order)
                try {
                    filesDelete(__dirname + `/files/${cookies}/${id}/`)
                } catch (e) {
                    console.log(e.message);
                }
                res.send(order)
            }
        })
    }
}

async function docToPdf(inputPath, cookies, filenameToNorm, res, id, calcType) {
    let folder = __dirname + `/files/${cookies}/${id}/pdf`
    try {
        if (!fs.existsSync(folder)){
            await fs.mkdirSync(folder)
        }
    } catch (err) {
        console.error(err.message)
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

    getInfoInPdf(inputPath, cookies, filenameToNorm, res, id, outputPath, calcType)

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

async function getInfoInPdf(inputPath, cookies, filenameToNorm, res, id, outputPath, calcType) {
    try {
        console.log(outputPath);
        const pdfPath =
            process.argv[2] || outputPath;

        const loadingTask = pdfjsLib.getDocument(pdfPath);
        loadingTask.promise.then(function (doc) {
            const numPages = doc.numPages;
            console.log(numPages);


            //отправка назад со всем говном--------
            let connection = mysql.createConnection(configSQLConnection);
            let data = [calcType, filenameToNorm, `/files/${cookies}/${id}/pdf/file1.pdf`, cookies, numPages];
            let sql = "INSERT INTO files(calc, name, path, session, countInFile) VALUES(?, ?, ?, ?, ?, ?)";
            connection.query(sql, data, function(err, results, fields){
                if(err) {
                    console.log(err);
                }
                else {
                    console.log("Сессии просмотрели");
                    console.log(results);
                    // res.send(results)
                }
            })

            // let ress = {
            //     url: `/files/${cookies}/${id}/pdf/file1.pdf`,
            // }
            // cookieStore.forEach(e => {
            //     if(e.cookie === cookies){
            //         let order = {
            //             calc: calcType,
            //             id: id,
            //             name : filenameToNorm,
            //             url: ress,
            //             format: "A4",
            //             countInFile: numPages
            //         }
            //         e.orders.push(order)
            //         res.send(order)
            //     }
            // })
            //-----------------------------

        })

    } catch (e) {
        console.log(e.message);
        let ress = {
            url: `/files/${cookies}/${id}/pdf/file1.pdf`,
        }
        cookieStore.forEach(e => {
            if(e.cookie === cookies){
                let order = {
                    calc: calcType,
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
}

app.post("/login", function (req, res) {
    let body = [];
    try {
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body)
            console.log(body);
            res.send("1")
        })
    } catch (e) {
        console.log(e.message);
    }
})

app.post("/getfiles", function (req, res) {
    let body = [];
    try {
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body)
            body.to = `files${body.to}`;
            console.log(`${body.to}`);
            getFilesForAdminView(req, res, body.to)
        })
    } catch (e) {
        console.log(e.message);
        let readdirInfo = []
        let reddirUnit = {
            error: e.toString()
        }
        readdirInfo.push(reddirUnit)
        res.send(readdirInfo)
    }
})

app.get("/getprices", function (req, res){
    res.send(tableMain)
})

function getStatsInFile(path) {
    try {
        const stats = fs.statSync (path)
        let statsToReturn = {
            birthtime: stats.birthtime,
            size: stats.size,
            error: false,
            isFile: stats.isFile()
        }
        return statsToReturn
    } catch (e) {
        let statsToReturn = {
            birthtime: "no",
            size: "no",
            error: e.toString(),
        }
        return statsToReturn
    }
}

app.post("/database", function (req, res){
    let body = [];
    try {
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body)
            console.log(body);

            if(body.do === "showAll"){
                getFilesForAdminView(req, res, `/data/database`)
            }
            else {
                res.send("1")
            }

        })
    } catch (err) {
        console.log(err.message);
    }
})

function getFilesForAdminView(req, res, url){
    try {
        let stats = fs.statSync (__dirname + `/${url}`)
        if(stats.isDirectory()){
            let readdir = fs.readdirSync(__dirname + `/${url}`)
            let readdirInfo = []
            for (let i = 0; i < readdir.length; i++){
                let path = __dirname + `/${url}/${readdir[i]}`
                let stats = getStatsInFile(path);
                let reddirUnit = {
                    name: readdir[i],
                    size: stats.size,
                    birthtime: stats.birthtime,
                    error: stats.error,
                    isFile: stats.isFile
                }
                readdirInfo.push(reddirUnit)
            }
            res.send(readdirInfo)
        } else if (stats.isFile()) {
            let readdirInfo = []
            let reddirUnit = {
                isFileOpen: true,
                name: "file",
                size: stats.size,
                birthtime: stats.birthtime,
                error: false,
                url: `/${url}`
            }
            readdirInfo.push(reddirUnit)
            res.send(readdirInfo)
        }
    } catch (e) {
        console.log(e.message);
        let readdirInfo = []
        let reddirUnit = {
            error: e.toString()
        }
        readdirInfo.push(reddirUnit)
        res.send(readdirInfo)
    }
}

app.get("/getSessies", function (req, res){
    let connection = mysql.createConnection(configSQLConnection);
    let sql = "SELECT * FROM sessies"
    connection.query(sql, function(err, results) {
        if(err) {
            console.log(err);
        }
        else {
            console.log("Сессии просмотрели");
            res.send(results)
        }
    });
})

app.delete("/getSessies", function (req, res){
    let body = [];
    try {
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body)
            console.log(body);

            if(body.do === "showAll"){
                getFilesForAdminView(req, res, `/data/database`)
            }
            else {
                res.send("1")
            }

        })
    } catch (err) {
        console.log(err.message);
    }


    let connection = mysql.createConnection(configSQLConnection);
    let sql = "SELECT * FROM sessies"
    connection.query(sql, function(err, results) {
        if(err) {
            console.log(err);
        }
        else {
            console.log("Session");
            res.send(results)
        }
    });
})

async function tiffToPng(filePath, cookies, filenameToNorm, res, id, calcType) {
    //need install the imagemagick
    let folder = __dirname + `/files/${cookies}/${id}/png`
    try {
        if (!fs.existsSync(folder)){
            await fs.mkdirSync(folder)
        }
    } catch (err) {
        console.error(err)
    }

    try {
        const { width, height, data } = decode(fs.readFileSync(__dirname + `/files/${cookies}/${id}/${filenameToNorm}`));

        const png =  new PNG({ width, height });
        png.data = data;
        fs.writeFileSync(__dirname + `/files/${cookies}/${id}/png/file.png`, PNG.sync.write(png));

        let ress = {
            url: `/files/${cookies}/${id}/png/file.png`,
        }
        cookieStore.forEach(e => {
            if (e.cookie === cookies) {
                let order = {
                    calc: calcType,
                    id: id,
                    name: filenameToNorm,
                    url: ress,
                    format: "A4",
                    countInFile: 1
                }
                e.orders.push(order)
                res.send(order)
            }
        })
    } catch (e) {
        console.log(e.message);
        res.send(e)
    }
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