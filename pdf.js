const mysql = require("mysql2");
const path = require("path");
const mime = require("mime");
const log = require('./back/log/log');
module.exports = {
    getInfoInPdf: async function getInfoInPdf(inputPath, cookies, filenameToNorm, res, id, outputPath, calcType, configSQLConnection) {
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
                log.addStatistics(0, 0, `update file, ${mime.getType(filePath)}`, "success", id, configSQLConnection)
            }
        })
    }
}