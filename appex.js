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
const logIn = require('./back/login/logIn');
const getSessionAndPagesCount = require('./back/getSessionAndPagesCount');
//price---------------------------------------------------------
const priceCounter = require('./back/price/ifsForThisTabl');
const processingPrice = require('./back/price/processingPrices');
//log---------------------------------------------------------
const log = require('./back/log/log');
//files---------------------------------------------------------
const getContentType = require('./back/files/getContentType');
const allAfterUpload = require('./allAfterUpload');
const files = require('./files');
const updateFile = require('./back/files/updateFile');
const deleteFile = require('./deleteFile');
//orders---------------------------------------------------------
const createOrder = require('./back/order/createOrder');
const getOrders = require('./back/order/getOrders');
//exel---------------------------------------------------------
const readXlsxFile = require('read-excel-file/node');
//mysql---------------------------------------------------------
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
let prices;
function readPrices() {
    readXlsxFile(fs.createReadStream(__dirname + "/data/newtableMain1.xlsx")).then((rows) => {
        tableMain = rows
        console.log("tableMain reading close with no err");
        prices = processingPrice.processingPricesInTableToPrices(tableMain)
        console.log("цены преобразованы");
    })
}

//for pdfJs---------------------------------------------------------
// const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
// const util = require("util");
// const stream = require("stream");
// const CMAP_URL = "../../node_modules/pdfjs-dist/cmaps/";
// const CMAP_PACKED = true;
//------------------------------------------------------------------

// const oneHour = 1000 * 60 * 60;
const port = 5555;
const cookieStore = []

app.use(busboy());
app.use(cookieParser('govnobliat'));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use("/", express.static(__dirname + "/front/main"));
app.use("/test", express.static(__dirname + "/front/main2"));
app.use("/createOrder", express.static(__dirname + "/front/createorder"));
app.use("/login", express.static(__dirname + "/front/login"));
app.use((req, res, next) => {
    if (req.url === "/orders") {
        if (req.method === "GET") {
            testHaveSessionOnGet(req, res, next, []);
        } else if (req.method === "POST") {
            testAndAddSession(req, res, next);
        } else {
            testHaveSession(req, res, next);
        }
    } else if (req.url === "/uploadFile") {
        testAndAddSession(req, res, next);
    } else if (req.url === "/uploadRedactedFile") {
        testHaveSession(req, res, next);
    } else if (req.url === "/parameterCalc" && req.method === "GET") {
        testAndAddSession(req, res, next);
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
    } else if (req.url === "/createOrder") {
        testHaveSession(req, res, next);
    } else if (req.url === "/getOrders") {
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

function testAndAddSession(req, res, next) {
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
                    log.addStatistics(0, 0, "add session "+cookieId.toString(), "query error", 0, configSQLConnection)
                    console.log(err);
                } else {
                    console.log("Сессия " + cookieId.toString() + " добавлена");
                    req.sessionId = results.insertId
                    req.sessionValue = cookieId.toString()
                    req.userId = 0
                    res.cookie('to', cookieId.toString())
                    // res.redirect(req.get('referer'));
                    // res.redirect('current');
                    log.addStatistics(0, 0, "add new session", "success", results.insertId, configSQLConnection, cookieId.toString())
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

        let data = [fieldname, "A4", "Йде обробка: " + filenameToNorm, `/files/data/processing.jpg`, req.sessionValue, true, 1, 0];
        let sql = "INSERT INTO files(calc, format, name, path, session, img, count, orderid) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
        let connection = mysql.createConnection(configSQLConnection);
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log("ФАЙЛ " + results.insertId + " " + filenameToNorm + " добавлен");
                allAfterUpload.afterFileLoad(req, res, results, filenameToNorm, fstream, fieldname, file, configSQLConnection);
                log.addStatistics(req.userId, req.sessionId, "upLoad file", "success", results.insertId, configSQLConnection, filenameToNorm)
            }
        });
        connection.end();
    });
});

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
                    log.addStatistics(req.userId, req.sessionId, "upLoad redacted file", "success", idForFile, configSQLConnection, 0)
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
            log.addStatistics(req.userId, req.sessionId, "add nonFile 'file' (for link)", "success", results.insertId, configSQLConnection, 0)
        }
    });
    connection.end();
});

app.get("/files*", function (req, res) {
    let urll = req.url;
    files.sendRes(urll, getContentType.getContentType(urll), res)
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
            let data = [body.data.calc, "A4", "БЕЗ ФАЙЛУ " + body.data.calc, `/files/data/notfile2.png`, req.sessionValue, true, 1, 1, 0];
            let sql = "INSERT INTO files(calc, format, name, path, session, img, count, countInFile, orderid) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
                    log.addStatistics(req.userId, req.sessionId, "add nonFile 'file'", "success", results.insertId, configSQLConnection, 0)
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
    let data = [req.cookies.to, 0];
    let sql = "SELECT * from files WHERE session = ? AND orderid = ?";
    connection.query(sql, data, function (err, results, fields) {
        if (err) {
            console.log(err);
        } else {
            // console.log(results.length);
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
            updateFile.update(req, res, body, configSQLConnection, prices)
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
            deleteFile.delete(req, res, body, configSQLConnection)
        })
    } catch (e) {
        console.log(e.message);
        res.send(e)
    }
});

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
                    if (results.length > 0) {
                        if (results[0].pass === body.pass) {
                            logIn.logIn(req, res, results, configSQLConnection);
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
                files.getFilesForAdminView(req, res, body.to)
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
    res.send(prices)
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
                getSessionAndPagesCount.getSessionsCountOfPage(req, res, body, configSQLConnection)
            })
        } catch (e) {
            console.log(e.message);
        }
    }
})

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
                        log.addStatistics(req.userId, req.sessionId, `add file to basket`, "success", body.id, configSQLConnection, 0)
                    } else {
                        res.send({
                            status: "error",
                            error: "Без файлу неможна додати до кошику та зробити замовлення. Замовлення в розробці."
                        })
                    }
                }
            })
            connection.end()
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
                    log.addStatistics(req.userId, req.sessionId, `remove file to basket`, "success", body.id, configSQLConnection, 0)
                }
            })
            connection.end()
        })
    } catch (err) {
        res.send({
            status: "error",
            error: err
        })
    }
})

app.post("/createOrder", function (req, res) {
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
            createOrder.create(req, res, body, configSQLConnection)
        })
    } catch (err) {
        res.send({
            status: "error",
            error: err
        })
    }
})

app.post("/getOrders", function (req, res) {
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
                getOrders.getOrders(req, res, body, configSQLConnection)
            })
        } catch (err) {
            res.send({
                status: "error",
                error: err
            })
        }
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
    const sql = "create table if not exists files(id int primary key auto_increment,name varchar(200),path varchar(250),userid int,session varchar(50),orderid int,img boolean,red boolean,format varchar(50),sides varchar(50),color varchar(50),cower varchar(50),paper varchar(50),destiny varchar(200),destinyThis varchar(200),binding varchar(50),bindingSelect varchar(50),lamination varchar(50),roundCorner varchar(50),frontLining varchar(50),backLining varchar(50),big varchar(100),holes varchar(50),countInFile integer, allPaperCount integer ,orient BOOLEAN,stickerCutting varchar(200),stickerCuttingThis varchar(200),x varchar(50),y varchar(50),list varchar(100),calc varchar(50),touse varchar(200),luvers varchar(200),bannerVarit varchar(200),floorLamination varchar(100),widthLamination varchar(100),price varchar(50), count int,canToOrder boolean, inBasket boolean)";
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
    const sql = "create table if not exists users(id int primary key auto_increment,name varchar(100),role varchar(45),mail varchar(100),pass varchar(100), phone varchar(45), messenger varchar(45))";
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
    const sql = "create table if not exists orders(id int primary key auto_increment,userid integer,session varchar(45),status varchar(45),executorid integer, destiny varchar(200), price varchar(200), timeCreate varchar(20))";
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
    const sql = "create table if not exists actions(id int primary key auto_increment,userid integer,session varchar(20),whatAction varchar(100),time varchar(20), result varchar(50), targetId integer, value varchar(200))";
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