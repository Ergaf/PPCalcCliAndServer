const mysql = require("mysql2");
module.exports = {
    getSessionsCountOfPage: function getSessionsCountOfPage(req, res, body, configSQLConnection){
        let connection = mysql.createConnection(configSQLConnection);
        let dataToSql = [body.inPageCount];
        let sql = "SELECT CEIL(COUNT(*)/?) as totalP FROM sessions;"
        // CEIL(COUNT(*)/?) as total_pages
        connection.query(sql, dataToSql,function (err, results) {
            if (err) {
                console.log(err);
            } else {
                getSessionsPageAndSend(req, res, body, results, configSQLConnection)
            }
        });
        connection.end();
    }
}

function getSessionsPageAndSend(req, res, body, resultsPageCount, configSQLConnection){
    let connection = mysql.createConnection(configSQLConnection);
    let dataToSql = [body.inPageCount, body.page];
    let sql = "SELECT * FROM sessions ORDER BY id DESC LIMIT ? OFFSET ?;"
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