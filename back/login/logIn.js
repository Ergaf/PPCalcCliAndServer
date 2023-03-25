const mysql = require("mysql2");
const log = require("../log/log");
module.exports = {
    logIn: function logIn(req, res, resultss, configSQLConnection) {
        let lol = Date.now()
        let cookieId = Date.now() + lol

        let connection = mysql.createConnection(configSQLConnection);
        let data = [cookieId.toString(), req.header('user-agent'), req.ip, resultss[0].id, Date.now().toString()];
        let sql = "INSERT INTO sessions(session, userAgent, ip, userid, time) VALUES(?, ?, ?, ?, ?)";
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                res.cookie('to', cookieId.toString())
                res.send({err: "no"})
                log.addStatistics(resultss[0].id, results.insertId, `add new session by login/delete session`, "success", 0, configSQLConnection, cookieId.toString())

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
}