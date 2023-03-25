const mysql = require("mysql2");
const files = require("./files");
const log = require("./back/log/log");
module.exports = {
    delete: function (req, res, body, configSQLConnection){
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
                    files.filesDelete(__dirname + `/files/${req.cookies.to}/${data[0]}/`)
                } catch (e) {
                    console.log(e.message);
                }
                res.send({
                    status: "ok",
                    id: body.id
                })
                log.addStatistics(req.userId, req.sessionId, `remove file`, "success", body.id, configSQLConnection, 0)
            }
        })
        connection.end();
    }
}