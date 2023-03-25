const mysql = require("mysql2");
module.exports = {
    create: function (req, res, body, configSQLConnection){
        console.log("userId "+req.userId);
        if(req.userId === 0){
            let connection = mysql.createConnection(configSQLConnection);
            let data = [body.name, "user", body.mail, body.phone, body.messenger];
            let sql = "INSERT INTO users(name, role, mail, phone, messenger) VALUES(?, ?, ?, ?, ?)";
            connection.query(sql, data, function (err, results, fields) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("user add");
                    sessionToUser(req, res, body, configSQLConnection, results.insertId)
                }
            })
            connection.end();
        } else {
            InsertOrder(req, res, body, configSQLConnection, req.userId)
        }
    }
}

function sessionToUser(req, res, body, configSQLConnection, resultsUsers){
    let connection = mysql.createConnection(configSQLConnection);
    let data = [resultsUsers, req.sessionId];
    let sql = "UPDATE sessions SET userid=? WHERE id = ?";
    connection.query(sql, data, function (err, resultsSessions, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log("session update");
            filesToOrder(req, res, body, configSQLConnection, resultsUsers)
        }
    })
    connection.end();
}

function InsertOrder(req, res, body, configSQLConnection, resultsUsers){
    let connection = mysql.createConnection(configSQLConnection);
    let data = [resultsUsers, "очікування", Date.now().toString()];
    let sql = "INSERT INTO orders(userid, status, timeCreate) VALUES(?, ?, ?)";
    connection.query(sql, data, function (err, resultsOrders, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log("order add");
            filesToOrder(req, res, body, configSQLConnection, resultsUsers, resultsOrders)
        }
    })
    connection.end();
}

function filesToOrder(req, res, body, configSQLConnection, resultsUsers, resultsOrders){
    let connection = mysql.createConnection(configSQLConnection);
    let data = [resultsOrders.insertId, req.sessionId, true];
    let sql = "UPDATE files SET orderid=? WHERE id = ? AND inBasket = ?";
    connection.query(sql, data, function (err, resultsSessions, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log("files update");
            res.send({
                status: "ok",
                orderId: resultsOrders.insertId
            })
        }
    })
    connection.end();
}