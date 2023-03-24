const mime = require("mime");
const fs = require("fs");
const mysql = require("mysql2");
const log = require('./back/log/log');
const doc = require('./doc');
const pdf = require('./pdf');
const path = require("path");
const pdff = require('pdf-parse');
module.exports = {
    afterFileLoad: function afterFileLoad(req, res, results, filenameToNorm, fstream, fieldname, file, configSQLConnection) {
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
    fstream.on('close', async function () {
        try {
            processing(filePath, req.sessionValue, filenameToNorm, res, results.insertId, fieldname, configSQLConnection)
        } catch (e) {
            console.log(e.message);
            res.send(e)
        }
    });
    }
}

async function processing(filePath, cookies, filenameToNorm, res, id, calcType, configSQLConnection) {
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
                log.addStatistics(0, 0, `update file, ${mime.getType(filePath)}`, "success", id, configSQLConnection)
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


        const dataBuffer = fs.readFileSync(__dirname + `/files/${cookies}/${id}/${filenameToNorm}`);
        pdff(dataBuffer).then(function(dataInPdf){
            let data = [filenameToNorm, `/files/${cookies}/${id}/pdf/file1.pdf`, true, false, dataInPdf.numpages, id]
            let sql = "UPDATE files SET name=?, path=?, canToOrder=?, img=?, countInFile=? WHERE id = ?";
            let connection = mysql.createConnection(configSQLConnection);
            connection.query(sql, data, function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    // pdf.getInfoInPdf(filePath, cookies, filenameToNorm, res, id, __dirname + `/files/${cookies}/${id}/pdf/file1.pdf`, configSQLConnection)
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
                        countInFile: dataInPdf.numpages,
                        canToOrder: true
                    }
                    res.send(order)
                    log.addStatistics(0, 0, `update file, ${mime.getType(filePath)}`, "success", id, configSQLConnection)
                }
            });
            connection.end();
        })
    } else if (mime.getType(filePath) === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        doc.docToPdf(filePath, cookies, filenameToNorm, res, id, calcType, configSQLConnection)
    } else if (mime.getType(filePath) === "application/msword") {
        doc.docToPdf(filePath, cookies, filenameToNorm, res, id, calcType, configSQLConnection)
    } else if (mime.getType(filePath) === "application/powerpoint") {
        doc.docToPdf(filePath, cookies, filenameToNorm, res, id, calcType, configSQLConnection)
    } else if (mime.getType(filePath) === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
        doc.docToPdf(filePath, cookies, filenameToNorm, res, id, calcType, configSQLConnection)
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
                log.addStatistics(0, 0, `update file, ${mime.getType(filePath)}, not support`, "success", id, configSQLConnection)
            }
        });
        connection.end();
    }
}