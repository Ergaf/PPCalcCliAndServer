const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
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
let databaseName = "newcalc";
const configSQLConnection = {
    host: "localhost",
    user: "root",
    database: databaseName,
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

// app.use((req, res, next) => {
//     console.log(req.ip);
//     next();
// })

app.use(busboy());
app.use(cookieParser('govnobliat'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    // console.log(req.cookies.to);
    let data = "0"
    // console.log(req.url);
    if(req.cookies.to){
        data = [req.cookies.to]
    }
    let connection = mysql.createConnection(configSQLConnection);
    let sql = "SELECT * from sessions WHERE session = ?";
    connection.query(sql, data, function(err, results, fields) {
            if(err) {
                console.log(err);
            }
            if(results.length > 0){
                // console.log(results); // собственно данные
                req.userRole = results[0].userid
                req.sessionId = results[0].id
                next();
            }
            if(results.length === 0){
                let lol = Date.now()
                let cookieId = Date.now()+lol

                let session = [cookieId.toString(), req.header('user-agent'), req.ip, 0];
                let sql = "INSERT INTO sessions(session, userAgent, ip, userid) VALUES(?, ?, ?, ?)";
                let connection1 = mysql.createConnection(configSQLConnection);
                connection1.query(sql, session, function(err, results) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log("Сессия "+cookieId.toString()+" добавлена");
                        res.cookie('to', cookieId.toString())
                        // res.redirect(req.get('referer'));
                        // res.redirect('current');
                        next();
                    }
                });
                connection1.end();
            }
            else {
                // connection.end();
                // console.log(results);
                // next();
            }
    });
    connection.end();
});
app.use((req, res, next) => {
    if(req.userRole !== 1){
        if(req.url === "/admin/" || req.url === "/admin"){
            res.redirect("/login")
        } else {
            next();
        }
    } else {
        next();
    }
})
app.use("/", express.static(__dirname + "/static"));
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

        let data = [fieldname, "A4", "Йде обробка: "+filenameToNorm, `/files/data/processing.jpg`, req.cookies.to, true, 1];
        let sql = "INSERT INTO files(calc, format, name, path, session, img, count) VALUES(?, ?, ?, ?, ?, ?, ?)";
        let connection = mysql.createConnection(configSQLConnection);
        connection.query(sql, data, function(err, results) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("ФАЙЛ "+results.insertId+" "+filenameToNorm+" добавлен");
                afterFileLoad(req, res, results, filenameToNorm, fstream, fieldname, file);
            }
        });
        connection.end();
    });
});
function afterFileLoad(req, res, results, filenameToNorm, fstream, fieldname, file) {
    let folder = __dirname + `/files/${req.cookies.to}`
    try {
        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder)
        }
    } catch (err) {
        console.error(err)
    }
    let folder1 = __dirname + `/files/${req.cookies.to}/${results.insertId}`
    try {
        if (!fs.existsSync(folder1)){
            fs.mkdirSync(folder1)
        }
    } catch (err) {
        console.error(err)
    }
    let filePath = path.join(__dirname + `/files/${req.cookies.to}/${results.insertId}/${filenameToNorm}`);
    fstream = fs.createWriteStream(filePath);
    file.pipe(fstream);
    fstream.on('close', function () {
        try {
            processing(filePath, req.cookies.to, filenameToNorm, res, results.insertId, fieldname)
        } catch (e) {
            console.log(e.message);
            res.send(e)
        }
    });
}

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
            let data = [`/files/${req.cookies.to}/${idForFile}/red/file`, idForFile]
            let sql = "UPDATE files SET path=? WHERE id = ?";
            let connection = mysql.createConnection(configSQLConnection);
            connection.query(sql, data, function(err, results) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log("ФАЙЛ "+idForFile+" отредактированный сохранен");
                    res.send(`/files/${req.cookies.to}/${idForFile}/red/file`);
                }
            });
            connection.end();
        });
    });
});

app.get("/parameterCalc", function (req, res) {
    let calc = req.query.calc;
    let paper = req.query.paper;
    let destiny = req.query.destiny;
    let format = req.query.format;

    let data = [calc, "A4", "БЕЗ ФАЙЛУ "+calc, `/files/data/notfile2.png`, req.cookies.to, true, paper, destiny, format, 1];
    let sql = "INSERT INTO files(calc, format, name, path, session, img, paper, destiny, format, count) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let connection = mysql.createConnection(configSQLConnection);
    connection.query(sql, data, function(err, results) {
        if(err) {
            console.log(err);
        }
        else {
            console.log("БЕЗ ФАЙЛУ "+results.insertId+" добавлена");

            res.redirect("/");
        }
    });
    connection.end();
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
            let data = [body.data.calc, "A4", "БЕЗ ФАЙЛУ "+body.data.calc, `/files/data/notfile2.png`, req.cookies.to, true, 1];
            let sql = "INSERT INTO files(calc, format, name, path, session, img, count) VALUES(?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, data, function(err, results, fields){
                if(err) {
                    console.log(err);
                }
                else {
                    // console.log(results);
                    let ress = {
                        url: `/files/data/notfile2.png`,
                        img: true,
                        red: false
                    }
                    let order = {
                        calc: body.data.calc,
                        count: 1,
                        id: results.insertId,
                        name : `БЕЗ ФАЙЛУ ${body.data.calc}`,
                        format: "A4",
                        countInFile: 1,
                        url: ress
                    }

                    res.send(order)
                }
            })
            connection.end();
        })
    }catch (e) {
        console.log(e.message);
    }
});
app.get("/orders", function (req, res) {
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
                    let order = e
                    order.url = ress
                    order.countInFile = 1
                    files.push(order)
                })
            }

            res.send(files)
        }
    })
    connection.end();
});

app.put("/orders", function (req, res) {
    let body = [];
    try {
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body)
            // console.log(body);

            let connection = mysql.createConnection(configSQLConnection);
            let data = [body.value, body.id]
            let sql = "UPDATE files SET "+body.parameter+"=? WHERE id = ?";
            if(body.parameter2){
                data = [body.value, body.value2, body.id]
                sql = "UPDATE files SET "+body.parameter+"=?, "+body.parameter2+"=? WHERE id = ?";
            }
            if(body.parameter3){
                data = [body.value, body.value2, body.value3, body.id]
                sql = "UPDATE files SET "+body.parameter+"=?, "+body.parameter2+"=?, "+body.parameter3+"=? WHERE id = ?";
            }
            connection.query(sql, data, function(err, results, fields){
                if(err) {
                    // console.log(err);
                    let sendData = {
                        status: "error",
                        error: `dontUpdateTable files, id=${body.id}`
                    }
                    res.send(sendData);
                }
                else {
                    // console.log(results);
                    let sendData = {
                        status: "ok",
                        // values: {
                        //     value1: body.value,
                        //     value2: body.value2,
                        //     value3: body.value3,
                        // }
                    }
                    res.send(sendData);
                }
            });
            connection.end();
        })
    } catch (e) {
        let sendData = {
            status: "error",
            error: "notParseBody"
        }
        res.send(sendData);
    }
});

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

        let data = [filenameToNorm, `/files/${cookies}/${id}/notpdf/file`, true, true, true, id]
        let sql = "UPDATE files SET name=?, path=?, img=?, red=?, canToOrder=? WHERE id = ?";
        let connection = mysql.createConnection(configSQLConnection);
        connection.query(sql, data, function(err, results) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("ФАЙЛ "+id+" "+filenameToNorm+" обновлен");
                let ress = {
                    urlOriginal: `/files/${cookies}/${id}/notpdf/file`,
                    url: `/files/${cookies}/${id}/notpdf/file`,
                    img: true,
                    red: true
                }
                let order = {
                    calc: calcType,
                    id: id,
                    name : filenameToNorm,
                    url: ress,
                    format: "A4",
                    countInFile: 1,
                    canToOrder: true
                }
                res.send(order)
            }
        });
        connection.end();
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
        let data = [filenameToNorm, `/files/${cookies}/${id}/pdf/file1.pdf`, true, id]
        let sql = "UPDATE files SET name=?, path=?, canToOrder=? WHERE id = ?";
        let connection = mysql.createConnection(configSQLConnection);
        connection.query(sql, data, function(err, results) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("ФАЙЛ "+id+" "+filenameToNorm+" обновлен");
                let ress = {
                    url: `/files/${cookies}/${id}/pdf/file1.pdf`,
                }
                let order = {
                    calc: calcType,
                    id: id,
                    name : filenameToNorm,
                    url: ress,
                    format: "A4",
                    countInFile: 1,
                    canToOrder: true
                }
                res.send(order)
            }
        });
        connection.end();
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
        let data = [filenameToNorm, `/files/data/errorNoFormat.png`, true, id]
        let sql = "UPDATE files SET name=?, path=?, img=? WHERE id = ?";
        let connection = mysql.createConnection(configSQLConnection);
        connection.query(sql, data, function(err, results) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("ФАЙЛ "+id+" "+filenameToNorm+" обновлен");
                let ress = {
                    url: `/files/data/errorNoFormat.png`,
                    img: true,
                    red: false
                }
                let order = {
                    calc: calcType,
                    id: id,
                    name : filenameToNorm,
                    url: ress,
                    format: "A4",
                    countInFile: 1
                }
                res.send(order)
            }
        });
        connection.end();
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
    let connection = mysql.createConnection(configSQLConnection);
    let data = [filenameToNorm, `/files/${cookies}/${id}/pdf/file1.pdf`, true, id]
    let sql = "UPDATE files SET name=?, path=?, canToOrder=? WHERE id = ?";
    connection.query(sql, data, function(err, results, fields){
        if(err) {
            console.log(err);
        }
        else {
            // console.log(results);
            let ress = {
                url: `/files/${cookies}/${id}/pdf/file1.pdf`,
            }
            let order = {
                calc: calcType,
                id: id,
                name : filenameToNorm,
                url: ress,
                format: "A4",
                countInFile: 1
            }
            res.send(order)
        }
    })
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

            let data = [body.login];
            let connection = mysql.createConnection(configSQLConnection);
            let sql = "SELECT * FROM users WHERE mail = ?"
            connection.query(sql, data,function(err, results) {
                if(err) {
                    console.log(err);
                }
                else {
                    // console.log("Сессии просмотрели");
                    if(results.length > 0){
                        if(results[0].pass === body.pass){
                            logIn(req, res, results);
                        } else {
                            res.send({err: "pass"})
                        }
                    } else {
                        res.send({err: "login"})
                    }
                }
            });
            connection.end();
        })
    } catch (e) {
        console.log(e.message);
    }
})
function logIn(req, res, results){
    let data = [results[0].id, req.sessionId];
    let connection = mysql.createConnection(configSQLConnection);
    let sql = "UPDATE sessions SET userid=? WHERE id = ?"
    connection.query(sql, data,function(err, results) {
        if(err) {
            console.log(err);
        }
        else {
            // console.log("Сессии просмотрели");
            res.send({err: "no"})
        }
    });
    connection.end();
}

app.post("/getfiles", function (req, res) {
    if(req.userRole !== 1){
        res.sendStatus(401)
    } else {
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
    if(req.userRole !== 1){
        res.sendStatus(401)
    } else {
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
    if(req.userRole !== 1){
        res.sendStatus(401)
    } else {
        let connection = mysql.createConnection(configSQLConnection);
        let sql = "SELECT * FROM sessions"
        connection.query(sql, function(err, results) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("Сессии просмотрели");
                res.send(results)
            }
        });
        connection.end();
    }
})

app.delete("/getSessies", function (req, res){
    if(req.userRole !== 1){
        res.sendStatus(401)
    } else {
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

                let connection = mysql.createConnection(configSQLConnection);
                let data = [body];
                let sql = "DELETE from sessions WHERE id = ?";
                connection.query(sql, data, function(err, results, fields){
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log("session "+body+" deleted by admin");
                        res.send(body)
                    }
                })
                connection.end();
            })
        } catch (err) {
            console.log(err.message);
        }
    }
})

let connectNotBdConfig = {
    host: "localhost",
    user: "root",
    // database: "calc",
    password: "1234"
}
const connectionNotBd = mysql.createConnection(connectNotBdConfig);
connectionNotBd.query("USE "+databaseName,
    function(err, results) {
        if(err){
            console.log(`БД "${databaseName}" не найдено, пытаемся создать...`);
            createDatabase()
        } else {
            console.log(`Подключено к БД "${databaseName}".`);
            startServer()
        }
    });
connectionNotBd.end();

function createDatabase(){
    const connectionNotBdCreate = mysql.createConnection(connectNotBdConfig);
    connectionNotBdCreate.query("CREATE DATABASE "+databaseName,
        function(err, results) {
            if(err){
                console.log(err);
            } else {
                console.log(`База данных "${databaseName}" успешно создана.`);
                createTableFiles();
            }
        });
    connectionNotBdCreate.end();
}

function createTableFiles(){
    const sql = "create table if not exists files(id int primary key auto_increment,name varchar(200),path varchar(250),userid int,session varchar(50),orderid int,img boolean,red boolean,format varchar(50),sides varchar(50),color varchar(50),cower varchar(50),paper varchar(50),destiny varchar(200),destinyThis varchar(200),binding varchar(50),bindingSelect varchar(50),lamination varchar(50),roundCorner varchar(50),frontLining varchar(50),backLining varchar(50),big varchar(50),holes varchar(50),allPaperCount varchar(50),orient BOOLEAN,stickerCutting varchar(200),stickerCuttingThis varchar(200),x varchar(50),y varchar(50),list varchar(50),calc varchar(50),touse varchar(200),luvers varchar(200),bannerVarit varchar(200),floorLamination varchar(50),widthLamination varchar(50),price varchar(50), count int,canToOrder boolean)";
    const connectionCreateTablFiles = mysql.createConnection(configSQLConnection);
    connectionCreateTablFiles.query(sql,
        function(err, results) {
            if(err){
                console.log(err);
            } else {
                console.log(`Таблица "files" успешно создана.`);
                createTableSessions();
            }
        });
    connectionCreateTablFiles.end();
}

function createTableSessions(){
    const sql = "create table if not exists sessions(id int primary key auto_increment,session varchar(45),userid int,userAgent varchar(250),ip varchar(45),ip2 varchar(45))";
    const connectionCreateTablSessions = mysql.createConnection(configSQLConnection);
    connectionCreateTablSessions.query(sql,
        function(err, results) {
            if(err){
                console.log(err);
            } else {
                console.log(`Таблица "sessions" успешно создана.`);
                createTableUsers();
            }
        });
    connectionCreateTablSessions.end();
}
function createTableUsers(){
    const sql = "create table if not exists users(id int primary key auto_increment,name varchar(100),role varchar(100),mail varchar(100),pass varchar(100))";
    const connectionCreateTablSessions = mysql.createConnection(configSQLConnection);
    connectionCreateTablSessions.query(sql,
        function(err, results) {
            if(err){
                console.log(err);
            } else {
                console.log(`Таблица "users" успешно создана.`);
                createTableOrders()
            }
        });
    connectionCreateTablSessions.end();
}
function createTableOrders(){
    const sql = "create table if not exists orders(id int primary key auto_increment,userid varchar(20),session varchar(45),status varchar(45),executorid varchar(20))";
    const connectionCreateTablSessions = mysql.createConnection(configSQLConnection);
    connectionCreateTablSessions.query(sql,
        function(err, results) {
            if(err){
                console.log(err);
            } else {
                console.log(`Таблица "orders" успешно создана.`);
                insertAdmin()
            }
        });
    connectionCreateTablSessions.end();
}

function insertAdmin(){
    let dataToSql = [
        "admin", "admin", "admin", "1234"
    ]
    const sql = "INSERT INTO users(name, role, mail, pass) VALUES(?, ?, ?, ?)";
    const connectionCreateTablSessions = mysql.createConnection(configSQLConnection);
    connectionCreateTablSessions.query(sql, dataToSql,
        function(err, results) {
            if(err){
                console.log(err);
            } else {
                console.log(`Стандартный админ добавлен: login: admin, pass: 1234`);
                readPrices();
            }
        });
    connectionCreateTablSessions.end();
}

function readPrices(){
    readXlsxFile(fs.createReadStream(__dirname + "/data/newtableMain.xlsx")).then((rows) => {
        tableMain = rows
        console.log("tableMain reading close with no err");
        startServer()
    })
}

function startServer(){
    let options = {
        key: fs.readFileSync(__dirname + "/data/s2/key.txt"),
        cert: fs.readFileSync(__dirname + "/data/s2/crt.txt"),
        ca: fs.readFileSync(__dirname + "/data/s2/cabundle.txt"),
    };
    const httpsServer = https.createServer(options, app);
    const httpServer = http.createServer(app);
    httpServer.listen(port, () => {
        console.log('HTTPS server running on port '+port);
    });
}