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
const {Poppler} = require("node-poppler");
const readXlsxFile = require('read-excel-file/node');
const fsEx = require('fs-extra');

const {decode} = require("decode-tiff");
const {PNG} = require("pngjs");

const mysql = require("mysql2");
let databaseName = "newcalc";
const configSQLConnection = {
    host: "localhost",
    user: "root",
    database: databaseName,
    password: "1234"
}
let connectNotBdConfig = {
    host: "localhost",
    user: "root",
    password: "1234"
}

let tableMain;
function readPrices() {
    readXlsxFile(fs.createReadStream(__dirname + "/data/newtableMain1.xlsx")).then((rows) => {
        tableMain = rows
        console.log("tableMain reading close with no err");
    })
}

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
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use("/", express.static(__dirname + "/front/main"));
app.use("/createOrder", express.static(__dirname + "/front/createorder"));
app.use("/login", express.static(__dirname + "/front/login"));
app.use((req, res, next) => {
    if (req.url === "/orders") {
        if (req.method === "GET") {
            testHaveSessionOnGet(req, res, next, []);
        } else if (req.method === "POST") {
            testAdnAddSession(req, res, next);
        } else {
            testHaveSession(req, res, next);
        }
    } else if (req.url === "/uploadFile") {
        testAdnAddSession(req, res, next);
    } else if (req.url === "/uploadRedactedFile") {
        testHaveSession(req, res, next);
    } else if (req.url === "/parameterCalc" && req.method === "GET") {
        testAdnAddSession(req, res, next);
    } else if (req.url === "/getSessies") {
        testHaveSession(req, res, next);
    } else if (req.url === "/getfiles") {
        testHaveSession(req, res, next);
    } else if (req.url === "/admin" || req.url === "/admin/") {
        testHaveSession(req, res, next);
    } else if (req.url === "/basket") {
        testHaveSession(req, res, next);
    } else if (req.url === "/adminfilesget") {
        testHaveSession(req, res, next);
    } else if (req.url === "/getStatistics") {
        testHaveSession(req, res, next);
    }
    else {
        next();
    }
})

function testHaveSessionOnGet(req, res, next, getForNeed) {
    if (req.cookies.to) {
        let data = [req.cookies.to]
        let connection = mysql.createConnection(configSQLConnection);
        let sql = "SELECT * from sessions WHERE session = ?";
        connection.query(sql, data, function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            if (results.length > 0) {
                req.userId = results[0].userid
                req.sessionId = results[0].id
                req.sessionValue = req.cookies.to
                next();
            } else {
                res.send(getForNeed);
            }
        });
        connection.end();
    } else {
        let orders = [];
        res.send(orders);
    }
}

function testHaveSession(req, res, next) {
    if (req.cookies.to) {
        let data = [req.cookies.to]
        let connection = mysql.createConnection(configSQLConnection);
        let sql = "SELECT * from sessions WHERE session = ?";
        connection.query(sql, data, function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            if (results.length > 0) {
                // console.log(results); // собственно данные
                req.userId = results[0].userid
                req.sessionId = results[0].id
                req.sessionValue = req.cookies.to
                next();
            } else {
                if (req.url === "/admin" || req.url === "/admin/") {
                    res.redirect("/login")
                } else {
                    res.sendStatus(401);
                }
            }
        });
        connection.end();
    } else {
        if (req.url === "/admin" || req.url === "/admin/") {
            res.redirect("/login")
        } else {
            res.sendStatus(401);
        }
    }
}

function testAdnAddSession(req, res, next) {
    let data = "0"
    if (req.cookies.to) {
        data = [req.cookies.to]
    }
    let connection = mysql.createConnection(configSQLConnection);
    let sql = "SELECT * from sessions WHERE session = ?";
    connection.query(sql, data, function (err, results, fields) {
        if (err) {
            console.log(err);
        }
        if (results.length > 0) {
            // console.log(results); // собственно данные
            req.userId = results[0].userid
            req.sessionId = results[0].id
            req.sessionValue = req.cookies.to
            next();
        }
        if (results.length === 0) {
            let lol = Date.now()
            let cookieId = Date.now() + lol

            let session = [cookieId.toString(), req.header('user-agent'), req.ip, 0, Date.now().toString()];
            let sql = "INSERT INTO sessions(session, userAgent, ip, userid, time) VALUES(?, ?, ?, ?, ?)";
            let connection1 = mysql.createConnection(configSQLConnection);
            connection1.query(sql, session, function (err, results) {
                if (err) {
                    addStatistics(0, 0, "add session "+cookieId.toString(), "query error", 0)
                    console.log(err);
                } else {
                    console.log("Сессия " + cookieId.toString() + " добавлена");
                    req.sessionId = results.insertId
                    req.sessionValue = cookieId.toString()
                    req.userId = 0
                    res.cookie('to', cookieId.toString())
                    // res.redirect(req.get('referer'));
                    // res.redirect('current');
                    addStatistics(0, 0, "add session "+cookieId.toString(), "success", results.insertId)
                    next();
                }
            });
            connection1.end();
        } else {
            // connection.end();
            // console.log(results);
            // next();
        }
    });
    connection.end();
}

app.use("/admin", express.static(__dirname + "/front/admin"));
// app.use("/3dtest", express.static(__dirname + "/admin/3dtest"));
// app.use("/red", express.static(__dirname + "/admin/image-editor/examples"));

app.post("/uploadFile", function (req, res) {
    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        let filenameToNorm = utf8.decode(filename.filename)
        console.log("Uploading file: " + filenameToNorm);

        let data = [fieldname, "A4", "Йде обробка: " + filenameToNorm, `/files/data/processing.jpg`, req.sessionValue, true, 1];
        let sql = "INSERT INTO files(calc, format, name, path, session, img, count) VALUES(?, ?, ?, ?, ?, ?, ?)";
        let connection = mysql.createConnection(configSQLConnection);
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log("ФАЙЛ " + results.insertId + " " + filenameToNorm + " добавлен");
                afterFileLoad(req, res, results, filenameToNorm, fstream, fieldname, file);
                addStatistics(req.userId, req.sessionId, "upLoad file", "success", results.insertId)
            }
        });
        connection.end();
    });
});

function afterFileLoad(req, res, results, filenameToNorm, fstream, fieldname, file) {
    let folder = __dirname + `/files/${req.sessionValue}`
    try {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }
    } catch (err) {
        console.error(err)
    }
    let folder1 = __dirname + `/files/${req.sessionValue}/${results.insertId}`
    try {
        if (!fs.existsSync(folder1)) {
            fs.mkdirSync(folder1)
        }
    } catch (err) {
        console.error(err)
    }
    let filePath = path.join(__dirname + `/files/${req.sessionValue}/${results.insertId}/${filenameToNorm}`);
    fstream = fs.createWriteStream(filePath);
    file.pipe(fstream);
    fstream.on('close', function () {
        try {
            processing(filePath, req.sessionValue, filenameToNorm, res, results.insertId, fieldname)
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
            if (!fs.existsSync(folder1)) {
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
            connection.query(sql, data, function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("ФАЙЛ " + idForFile + " отредактированный сохранен");
                    res.send(`/files/${req.cookies.to}/${idForFile}/red/file`);
                    addStatistics(req.userId, req.sessionId, "upLoad redacted file", "success", idForFile)
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

    let data = [calc, "A4", "БЕЗ ФАЙЛУ " + calc, `/files/data/notfile2.png`, req.sessionId, true, paper, destiny, format, 1];
    let sql = "INSERT INTO files(calc, format, name, path, session, img, paper, destiny, format, count) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let connection = mysql.createConnection(configSQLConnection);
    connection.query(sql, data, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("БЕЗ ФАЙЛУ " + results.insertId + " добавлена");

            res.redirect("/");
            addStatistics(req.userId, req.sessionId, "add nonFile 'file' (for link)", "success", results.insertId)
        }
    });
    connection.end();
});

app.get("/files*", function (req, res) {
    let urll = req.url;
    // console.log(`a request came for a file to url ${urll}`);
    sendRes(urll, getContentType(urll), res)
});
app.get("/d3*", function (req, res) {
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
            let data = [body.data.calc, "A4", "БЕЗ ФАЙЛУ " + body.data.calc, `/files/data/notfile2.png`, req.sessionValue, true, 1];
            let sql = "INSERT INTO files(calc, format, name, path, session, img, count) VALUES(?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, data, function (err, results, fields) {
                if (err) {
                    console.log(err);
                } else {
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
                        name: `БЕЗ ФАЙЛУ ${body.data.calc}`,
                        format: "A4",
                        countInFile: 1,
                        url: ress
                    }

                    res.send(order)
                    addStatistics(req.userId, req.sessionId, "add nonFile 'file'", "success", results.insertId)
                }
            })
            connection.end();
        })
    } catch (e) {
        console.log(e.message);
    }
});
app.get("/orders", function (req, res) {
    let connection = mysql.createConnection(configSQLConnection);
    let data = [req.cookies.to];
    let sql = "SELECT * from files WHERE session = ?";
    connection.query(sql, data, function (err, results, fields) {
        if (err) {
            console.log(err);
        } else {
            // console.log(results);
            let files = [];
            if (results.length > 0) {
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
            let sql = "UPDATE files SET " + body.parameter + "=? WHERE id = ?";
            if (body.parameter2) {
                data = [body.value, body.value2, body.id]
                sql = "UPDATE files SET " + body.parameter + "=?, " + body.parameter2 + "=? WHERE id = ?";
            }
            if (body.parameter3) {
                data = [body.value, body.value2, body.value3, body.id]
                sql = "UPDATE files SET " + body.parameter + "=?, " + body.parameter2 + "=?, " + body.parameter3 + "=? WHERE id = ?";
            }
            connection.query(sql, data, function (err, results, fields) {
                if (err) {
                    // console.log(err);
                    let sendData = {
                        status: "error",
                        error: `dontUpdateTable files, id=${body.id}`
                    }
                    res.send(sendData);
                } else {
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
                    addStatistics(req.userId, req.sessionId, `update file, use ${body.parameter}`, "success", body.id)
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
            connection.query(sql, data, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    res.send({
                        status: "error",
                        error: err
                    })
                } else {
                    if(results.affectedRows > 0){
                        console.log("delete file id " + data[0]);
                    } else {
                        console.log("not can find and delete file id " + data[0]);
                    }
                    try {
                        filesDelete(__dirname + `/files/${req.cookies.to}/${data[0]}/`)
                    } catch (e) {
                        console.log(e.message);
                    }
                    res.send({
                        status: "ok",
                        id: body.id
                    })
                    addStatistics(req.userId, req.sessionId, `remove file`, "success", body.id)
                }
            })
            connection.end();
        })
    } catch (e) {
        console.log(e.message);
        res.send(e)
    }
});

function filesDelete(y) {
    let y1 = fs.readdirSync(y);
    for (let x of y1) {
        let stat = fs.statSync(y + x); // тут забыли путь
        if (!stat.isFile()) {
            let path = y + x + '/';
            filesDelete(path);
        } else {
            fs.unlinkSync(y + x)
        }
    }
}

function sendRes(url, contentType, res) {
    let file = path.join(__dirname + url)
    fs.readFile(file, (err, content) => {
        if (err) {
            res.writeHead(404)
            res.write("file not found")
            res.end();
            console.log("file not found " + file);
        } else {
            res.writeHead(200, {"Content-Type": contentType})
            res.write(content)
            res.end();
            console.log("sucess! " + file);
        }
    })
}

async function processing(filePath, cookies, filenameToNorm, res, id, calcType) {
    console.log(`uploading file mime type: ${mime.getType(filePath)}, calcType: ${calcType}`);
    if (
        mime.getType(filePath) === "image/x-jpeg" ||
        mime.getType(filePath) === "image/jpeg" ||
        mime.getType(filePath) === "image/x-png" ||
        mime.getType(filePath) === "image/png" ||
        mime.getType(filePath) === "image/x-jpg" ||
        mime.getType(filePath) === "image/jpg"
    ) {
        let folder = __dirname + `/files/${cookies}/${id}/notPdf`
        try {
            if (!fs.existsSync(folder)) {
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
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log("ФАЙЛ " + id + " " + filenameToNorm + " обновлен");
                let ress = {
                    urlOriginal: `/files/${cookies}/${id}/notpdf/file`,
                    url: `/files/${cookies}/${id}/notpdf/file`,
                    img: true,
                    red: true
                }
                let order = {
                    calc: calcType,
                    count: 1,
                    id: id,
                    name: filenameToNorm,
                    url: ress,
                    format: "A4",
                    countInFile: 1,
                    canToOrder: true
                }
                res.send(order)
                addStatistics(0, 0, `update file, ${mime.getType(filePath)}`, "success", id)
            }
        });
        connection.end();
    } else if (mime.getType(filePath) === "application/pdf") {
        // toPng(filePath, cookies, filenameToNorm, res, id)
        let folder = __dirname + `/files/${cookies}/${id}/pdf`
        try {
            if (!fs.existsSync(folder)) {
                await fs.mkdirSync(folder)
            }
        } catch (err) {
            console.error(err.message)
        }
        fs.createReadStream(__dirname + `/files/${cookies}/${id}/${filenameToNorm}`)
            .pipe(fs.createWriteStream(__dirname + `/files/${cookies}/${id}/pdf/file1.pdf`));

        // getInfoInPdf(filePath, cookies, filenameToNorm, res, id, __dirname + `/files/${cookies}/${id}/pdf/file1.pdf`)
        let data = [filenameToNorm, `/files/${cookies}/${id}/pdf/file1.pdf`, true, false, id]
        let sql = "UPDATE files SET name=?, path=?, canToOrder=?, img=? WHERE id = ?";
        let connection = mysql.createConnection(configSQLConnection);
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log("ФАЙЛ " + id + " " + filenameToNorm + " обновлен");
                let ress = {
                    url: `/files/${cookies}/${id}/pdf/file1.pdf`,
                }
                let order = {
                    calc: calcType,
                    count: 1,
                    id: id,
                    name: filenameToNorm,
                    url: ress,
                    format: "A4",
                    countInFile: 1,
                    canToOrder: true
                }
                res.send(order)
                addStatistics(0, 0, `update file, ${mime.getType(filePath)}`, "success", id)
            }
        });
        connection.end();
    } else if (mime.getType(filePath) === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        docToPdf(filePath, cookies, filenameToNorm, res, id, calcType)
    } else if (mime.getType(filePath) === "application/msword") {
        docToPdf(filePath, cookies, filenameToNorm, res, id, calcType)
    } else if (mime.getType(filePath) === "application/powerpoint") {
        docToPdf(filePath, cookies, filenameToNorm, res, id, calcType)
    } else if (mime.getType(filePath) === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
        docToPdf(filePath, cookies, filenameToNorm, res, id, calcType)
    }
        // else if(mime.getType(filePath) === "image/tiff"){
        //     tiffToPng(filePath, cookies, filenameToNorm, res, id, calcType)
    // }
    else {
        let data = [filenameToNorm, `/files/data/errorNoFormat.png`, true, id]
        let sql = "UPDATE files SET name=?, path=?, img=? WHERE id = ?";
        let connection = mysql.createConnection(configSQLConnection);
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log("ФАЙЛ " + id + " " + filenameToNorm + " обновлен");
                let ress = {
                    url: `/files/data/errorNoFormat.png`,
                    img: true,
                    red: false
                }
                let order = {
                    calc: calcType,
                    id: id,
                    name: filenameToNorm,
                    url: ress,
                    format: "A4",
                    countInFile: 1
                }
                res.send(order)
                addStatistics(0, 0, `update file, ${mime.getType(filePath)}, not support`, "success", id)
            }
        });
        connection.end();
    }
}

async function docToPdf(inputPath, cookies, filenameToNorm, res, id, calcType) {
    let folder = __dirname + `/files/${cookies}/${id}/pdf`
    try {
        if (!fs.existsSync(folder)) {
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
    console.log("sucess in pdf!!!" + filenameToNorm);

    getInfoInPdf(inputPath, cookies, filenameToNorm, res, id, outputPath, calcType)

    // await toPng(outputPath, cookies, filenameToNorm, res, id)
}

function getContentType(url) {
    switch (path.extname(url)) {
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
    let data = [filenameToNorm, `/files/${cookies}/${id}/pdf/file1.pdf`, true, false, id]
    let sql = "UPDATE files SET name=?, path=?, canToOrder=?, img=? WHERE id = ?";
    connection.query(sql, data, function (err, results, fields) {
        if (err) {
            console.log(err);
        } else {
            // console.log(results);
            let ress = {
                url: `/files/${cookies}/${id}/pdf/file1.pdf`,
            }
            let order = {
                calc: calcType,
                id: id,
                name: filenameToNorm,
                url: ress,
                format: "A4",
                countInFile: 1
            }
            res.send(order)
            let filePath = path.join(__dirname + `/files/${cookies}/${id}/pdf/file1.pdf`)
            addStatistics(0, 0, `update file, ${mime.getType(filePath)}`, "success", id)
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
            connection.query(sql, data, function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log("Сессии просмотрели");
                    if (results.length > 0) {
                        if (results[0].pass === body.pass) {
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

function logIn(req, res, resultss) {
    let lol = Date.now()
    let cookieId = Date.now() + lol

    let connection = mysql.createConnection(configSQLConnection);
    let data = [cookieId.toString(), req.header('user-agent'), req.ip, resultss[0].id, Date.now().toString()];
    let sql = "INSERT INTO sessions(session, userAgent, ip, userid, time) VALUES(?, ?, ?, ?, ?)";
    connection.query(sql, data, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            // console.log("Сессии просмотрели");
            res.cookie('to', cookieId.toString())
            res.send({err: "no"})
            addStatistics(resultss[0].id, results.insertId, `add new session by login/delete session`, "success", 0)

            if (req.cookies.to) {
                let connectionDel = mysql.createConnection(configSQLConnection);
                let data = [req.cookies.to];
                let sql = "DELETE from sessions WHERE session = ?";
                connectionDel.query(sql, data, function (err, results, fields) {
                    if (err) {
                        console.log("session " + req.cookies.to + " not exist in bd");
                    } else {
                        console.log("session " + req.cookies.to + " deleted by login after add new logInSession");
                    }
                })
                connectionDel.end();
            }
        }
    });
    connection.end();
}

app.post("/adminfilesget", function (req, res) {
    console.log(req.userId);
    if (req.userId !== 1) {
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

app.get("/getprices", function (req, res) {
    res.send(tableMain)
})

app.get("/getStatistics", function (req, res) {
    if (req.userId !== 1) {
        res.sendStatus(401)
    } else {
        let connection = mysql.createConnection(configSQLConnection);
        let sql = "SELECT * FROM actions"
        connection.query(sql, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log("actions(статистику) просмотрели");
                res.send(results)
            }
        });
        connection.end();
    }
})

function getStatsInFile(path) {
    try {
        const stats = fs.statSync(path)
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

function getFilesForAdminView(req, res, url) {
    try {
        let stats = fs.statSync(__dirname + `/${url}`)
        if (stats.isDirectory()) {
            let readdir = fs.readdirSync(__dirname + `/${url}`)
            let readdirInfo = []
            for (let i = 0; i < readdir.length; i++) {
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

app.post("/getSessies", function (req, res) {
    if (req.userId !== 1) {
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
                getSessionsCountOfPage(req, res, body)
            })
        } catch (e) {
            console.log(e.message);
        }
    }
})
function getSessionsCountOfPage(req, res, body){
    let connection = mysql.createConnection(configSQLConnection);
    let dataToSql = [body.inPageCount];
    let sql = "SELECT CEIL(COUNT(*)/?) as totalP FROM sessions;"
    // CEIL(COUNT(*)/?) as total_pages
    connection.query(sql, dataToSql,function (err, results) {
        if (err) {
            console.log(err);
        } else {
            getSessionsPageAndSend(req, res, body, results)
        }
    });
    connection.end();
}
function getSessionsPageAndSend(req, res, body, resultsPageCount){
    let connection = mysql.createConnection(configSQLConnection);
    let dataToSql = [body.inPageCount, body.page];
    let sql = "SELECT * FROM sessions ORDER BY id DESC LIMIT ? OFFSET ?;"
    // CEIL(COUNT(*)/?) as total_pages
    connection.query(sql, dataToSql,function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("Сессии просмотрели");
            let toSend = {
                pageCount: resultsPageCount[0].totalP,
                data: results
            }
            res.send(toSend)
        }
    });
    connection.end();
}

app.delete("/getSessies", function (req, res) {
    if (req.userId !== 1) {
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
                connection.query(sql, data, function (err, results, fields) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("session " + body + " deleted by admin");
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

app.post("/basket", function (req, res) {
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
            let data = [true, body.id, true]
            let sql = "UPDATE files SET inBasket=? WHERE id = ? AND canToOrder=?";
            connection.query(sql, data, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    res.send({
                        status: "error",
                        error: err
                    })
                } else {
                    if(results.changedRows > 0){
                        res.send({
                            status: "ok",
                            id: body.id
                        })
                        addStatistics(req.userId, req.sessionId, `add file to basket`, "success", body.id)
                    } else {
                        res.send({
                            status: "error",
                            error: "Без файлу неможна додати до кошику та зробити замовлення. Замовлення в розробці."
                        })
                    }
                }
            })
        })
    } catch (err) {
        res.send({
            status: "error",
            error: err
        })
    }
})

app.delete("/basket", function (req, res) {
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
            let data = [false, body.id]
            let sql = "UPDATE files SET inBasket=? WHERE id = ?";
            connection.query(sql, data, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    res.send({
                        status: "error",
                        error: err
                    })
                } else {
                    res.send({
                        status: "ok",
                        id: body.id
                    })
                    addStatistics(req.userId, req.sessionId, `remove file to basket`, "success", body.id)
                }
            })
        })
    } catch (err) {
        res.send({
            status: "error",
            error: err
        })
    }
})

const connectionNotBd = mysql.createConnection(connectNotBdConfig);
connectionNotBd.query("USE " + databaseName,
    function (err, results) {
        if (err) {
            console.log(`БД "${databaseName}" не найдено, пытаемся создать...`);
            readPrices()
            createDatabase()
            startServer()
        } else {
            console.log(`Подключено к БД "${databaseName}".`);
            readPrices()
            startServer()
        }
    });
connectionNotBd.end();

function createDatabase() {
    const connectionNotBdCreate = mysql.createConnection(connectNotBdConfig);
    connectionNotBdCreate.query("CREATE DATABASE " + databaseName,
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(`База данных "${databaseName}" успешно создана.`);
                createTableFiles();
            }
        });
    connectionNotBdCreate.end();
}

function createTableFiles() {
    const sql = "create table if not exists files(id int primary key auto_increment,name varchar(200),path varchar(250),userid int,session varchar(50),orderid int,img boolean,red boolean,format varchar(50),sides varchar(50),color varchar(50),cower varchar(50),paper varchar(50),destiny varchar(200),destinyThis varchar(200),binding varchar(50),bindingSelect varchar(50),lamination varchar(50),roundCorner varchar(50),frontLining varchar(50),backLining varchar(50),big varchar(100),holes varchar(50),allPaperCount varchar(50),orient BOOLEAN,stickerCutting varchar(200),stickerCuttingThis varchar(200),x varchar(50),y varchar(50),list varchar(100),calc varchar(50),touse varchar(200),luvers varchar(200),bannerVarit varchar(200),floorLamination varchar(100),widthLamination varchar(100),price varchar(50), count int,canToOrder boolean, inBasket boolean)";
    const connectionCreateTablFiles = mysql.createConnection(configSQLConnection);
    connectionCreateTablFiles.query(sql,
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Таблица "files" успешно создана.`);
                createTableSessions();
            }
        });
    connectionCreateTablFiles.end();
}

function createTableSessions() {
    const sql = "create table if not exists sessions(id int primary key auto_increment,session varchar(45),userid int,userAgent varchar(400),ip varchar(45),time varchar(20))";
    const connectionCreateTablSessions = mysql.createConnection(configSQLConnection);
    connectionCreateTablSessions.query(sql,
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Таблица "sessions" успешно создана.`);
                createTableUsers();
            }
        });
    connectionCreateTablSessions.end();
}

function createTableUsers() {
    const sql = "create table if not exists users(id int primary key auto_increment,name varchar(100),role varchar(100),mail varchar(100),pass varchar(100))";
    const connectionCreateTablSessions = mysql.createConnection(configSQLConnection);
    connectionCreateTablSessions.query(sql,
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Таблица "users" успешно создана.`);
                createTableOrders()
            }
        });
    connectionCreateTablSessions.end();
}

function createTableOrders() {
    const sql = "create table if not exists orders(id int primary key auto_increment,userid integer,session varchar(45),status varchar(45),executorid integer)";
    const connectionCreateTablSessions = mysql.createConnection(configSQLConnection);
    connectionCreateTablSessions.query(sql,
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Таблица "orders" успешно создана.`);
                insertAdmin()
            }
        });
    connectionCreateTablSessions.end();
}

function insertAdmin() {
    let dataToSql = [
        "admin", "admin", "admin", "1234"
    ]
    const sql = "INSERT INTO users(name, role, mail, pass) VALUES(?, ?, ?, ?)";
    const connectionCreateTablSessions = mysql.createConnection(configSQLConnection);
    connectionCreateTablSessions.query(sql, dataToSql,
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Стандартный админ добавлен: login: admin, pass: 1234`);
                createTableAllActions()
            }
        });
    connectionCreateTablSessions.end();
}

function createTableAllActions() {
    const sql = "create table if not exists actions(id int primary key auto_increment,userid integer,session varchar(20),whatAction varchar(45),time varchar(20), result varchar(100), targetId integer)";
    const connectionCreateTablSessions = mysql.createConnection(configSQLConnection);
    connectionCreateTablSessions.query(sql,
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Таблица "actions" успешно создана.`);
            }
        });
    connectionCreateTablSessions.end();
}

function addStatistics(userid, session, whatAction, result, targetId) {
    let dataToSql = [
        userid, session, whatAction, Date.now().toString(), result, targetId
    ]
    const sql = "INSERT INTO actions(userid, session, whatAction, time, result, targetId) VALUES(?, ?, ?, ?, ?, ?)";
    const connectionCreateTablActions = mysql.createConnection(configSQLConnection);
    connectionCreateTablActions.query(sql, dataToSql,
        function (err, results) {
            if (err) {
                console.log(err);
            } else {

            }
        });
    connectionCreateTablActions.end();
}

function startServer() {
    let options = {
        key: fs.readFileSync(__dirname + "/data/s2/key.txt"),
        cert: fs.readFileSync(__dirname + "/data/s2/crt.txt"),
        ca: fs.readFileSync(__dirname + "/data/s2/cabundle.txt"),
    };
    const httpsServer = https.createServer(options, app);
    const httpServer = http.createServer(app);
    httpServer.listen(port, () => {
        console.log('HTTPS server running on port ' + port);
    });
}