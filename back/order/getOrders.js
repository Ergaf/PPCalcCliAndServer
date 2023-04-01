const mysql = require("mysql2");
module.exports = {
    getOrders: function getOrders(req, res, body, configSQLConnection){
        let connection = mysql.createConnection(configSQLConnection);
        let dataToSql = [body.inPageCount];
        let sql = "SELECT CEIL(COUNT(*)/?) as totalP FROM orders;"
        connection.query(sql, dataToSql,function (err, results) {
            if (err) {
                console.log(err);
                let toSend = {
                    status: "error",
                    error: "mySql error"
                }
                res.send(toSend)
            } else {
                getOrdersPageAndSend(req, res, body, results, configSQLConnection)
            }
        });
        connection.end();
    }
}

function getOrdersPageAndSend(req, res, body, resultsPageCount, configSQLConnection){
    let connection = mysql.createConnection(configSQLConnection);

    let isPageToNumber = 0;
    if(body.page > 1){
        isPageToNumber = body.page*body.inPageCount
        isPageToNumber = isPageToNumber - body.inPageCount;
        // console.log(isPageToNumber);
    }

    let dataToSql = [body.inPageCount, isPageToNumber];
    let sql = "SELECT * FROM orders ORDER BY id DESC LIMIT ? OFFSET ?;"
    connection.query(sql, dataToSql,function (err, results) {
        if (err) {
            console.log(err);
            let toSend = {
                status: "error",
                error: "mySql error"
            }
            res.send(toSend)
        } else {
            console.log("Замовлення просмотрели");
            let toSend = {
                status: "ok",
                data: {
                    pageCount: resultsPageCount[0].totalP,
                    page: body.page,
                    data: results
                }
            }
            res.send(toSend)
        }
    });
    connection.end();
}