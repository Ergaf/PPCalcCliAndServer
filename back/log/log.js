const mysql = require("mysql2");
module.exports = {
    addStatistics: function addStatistics(userid, session, whatAction, result, targetId, configSQLConnection) {
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
}