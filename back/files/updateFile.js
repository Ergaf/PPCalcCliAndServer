const mysql = require("mysql2");
const log = require("../log/log");
let thisFile;
module.exports = {
    update: function (req, res, body, configSQLConnection, prices) {
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
                    error: `dontUpdateTable files use ${body.parameter}`
                }
                res.send(sendData);
            } else {
                calcPrice(req, res, body, results, configSQLConnection, prices)
                log.addStatistics(req.userId, req.sessionId, `update file, use ${body.parameter} and ${body.parameter2} and ${body.parameter3}`, "success", body.id, configSQLConnection, body.value)
            }
        });
        connection.end();
    }
}

function calcPrice(req, res, body, results1, configSQLConnection, prices){
    let connection = mysql.createConnection(configSQLConnection);
    let data = [body.id];
    let sql = "SELECT * from files WHERE id = ?";
    connection.query(sql, data, function (err, results2, fields) {
        if (err) {
            console.log(err);
        } else {
            ifConditions(req, res, body, results1, results2, configSQLConnection, prices)
        }
    })
    connection.end();
}

function ifConditions(req, res, body, results1, results2, configSQLConnection, prices){
    thisFile = results2[0];
    let priceCalc = 0;
    let realCount = results2[0].count
    thisFile.realCount = realCount
    let allPaperCount = results2[0].count*results2[0].countInFile

    //conditions----------------------------------------------------------------------------------------
    //digital----------------------------------------------------------------------------------------
    if(results2[0].format !== "custom"){
        getSize(prices)
    }
    if (results2[0].calc === "digital"){
        if(results2[0].format === "A4" || results2[0].format === "A3"){
            realCount = results2[0].count*results2[0].countInFile
            thisFile.realCount = realCount
            let paperPrice = getPriceFromCountPaper(results2[0].destiny, prices)
            let laminationPrice = getPriceFromCount(results2[0].lamination, "Ламінування", results2[0].format, prices)
            if(!isNaN(paperPrice) && paperPrice !== undefined){
                priceCalc = paperPrice*realCount
            }
            if(!isNaN(laminationPrice) && laminationPrice !== undefined){
                let lamPrice = laminationPrice*realCount
                priceCalc = priceCalc + lamPrice
            }
        }
        else {
            let sss = Math.ceil(results2[0].count*results2[0].countInFile / getHowInASheet())
            realCount = sss
            thisFile.realCount = realCount
            let paperPrice = getPriceFromCountPaper(results2[0].destiny, prices)
            let laminationPrice = getPriceFromCount(results2[0].lamination, "Ламінування", results2[0].format, prices)
            if(!isNaN(paperPrice) && paperPrice !== undefined){
                priceCalc = paperPrice*sss;
            }
            if(!isNaN(laminationPrice) && laminationPrice !== undefined){
                let lamPrice = laminationPrice*sss
                priceCalc = priceCalc + lamPrice;
            }
        }
        let bigPrice = getPriceFromCount(results2[0].big, "згиби", results2[0].format, prices)*allPaperCount
        let holesPrice = getPriceFromCount(results2[0].holes, "отвір", results2[0].format, prices)*allPaperCount
        let roundCornerPrice = getPriceFromCount(results2[0].roundCorner, "кути", results2[0].format, prices)*allPaperCount
        let cowerPrice = getPriceFromCount(results2[0].cower, "обкладинка", results2[0].format, prices)*allPaperCount



        let bindingPrice = getBindingFromPaperCount("брошурування", prices).filter(e => e[0] === results2[0].binding)

        priceCalc = priceCalc + bigPrice
        priceCalc = priceCalc + holesPrice
        priceCalc = priceCalc + roundCornerPrice
        priceCalc = priceCalc + cowerPrice
        if(bindingPrice[0]){
            priceCalc = priceCalc + bindingPrice[0][1]
        }
        thisFile.price = priceCalc;
        updateFileAndAddPrice(req, res, body, results1, results2, configSQLConnection, prices, thisFile)
        //wide----------------------------------------------------------------------------------------------------------------------
    } else if (results2[0].calc === "wide") {
        let paper1 = getVariantsFromNameInData(thisFile.touse, prices);
        let paper2 = getVariantsFromNameInData(thisFile.destiny, prices);

        thisFile.realCount = thisFile.count*thisFile.countInFile

        let mm = thisFile.x * thisFile.y
        let m2kv = mm/1000000

        if(paper1 !== undefined){
            if(paper2 !== undefined){
                for (let i = 0; i < paper2.length; i++) {
                    if(thisFile.destinyThis === paper2[i][0]){
                        priceCalc = paper2[i][1] * m2kv * thisFile.realCount
                    }
                }
            }
            else {
                for (let i = 0; i < paper1.length; i++) {
                    if(thisFile.destiny === paper1[i][0]){
                        priceCalc = paper1[i][1] * m2kv * thisFile.realCount
                    }
                }
            }
        }
        thisFile.price = priceCalc.toFixed(2);
        updateFileAndAddPrice(req, res, body, results1, results2, configSQLConnection, prices, thisFile)
        //photo----------------------------------------------------------------------------------------------------------------------
    } else if (results2[0].calc === "photo"){
        let cupPrice = getPriceFromCount(thisFile.format, "ФОТО ДРУК", undefined, prices)
        thisFile.price = cupPrice*thisFile.count
        updateFileAndAddPrice(req, res, body, results1, results2, configSQLConnection, prices, thisFile)
        //cup----------------------------------------------------------------------------------------------------------------------
    } else if (results2[0].calc === "cup") {
        let cupPrice = getPriceFromCount(thisFile.destiny, "чашки", undefined, prices)
        thisFile.price = cupPrice*thisFile.count
        updateFileAndAddPrice(req, res, body, results1, results2, configSQLConnection, prices, thisFile)
        //afterPrint----------------------------------------------------------------------------------------------------------------------
    } else if (results2[0].calc === "afterPrint"){
        let cupPrice = getPriceFromCount(thisFile.destiny, "Післядрукарська обробка", undefined, prices)
        thisFile.price = cupPrice*thisFile.count
        updateFileAndAddPrice(req, res, body, results1, results2, configSQLConnection, prices, thisFile)

    }
}

function updateFileAndAddPrice(req, res, body, results1, results2, configSQLConnection, prices, thisFile){
    let connection = mysql.createConnection(configSQLConnection);
    let data = [thisFile.price, body.id]
    let sql = "UPDATE files SET price=? WHERE id = ?";
    connection.query(sql, data, function (err, results, fields) {
        if (err) {
            let sendData = {
                status: "error",
                error: `dontUpdateTable files price because ${thisFile.price}`
            }
            res.send(sendData);
        } else {
            let sendData = {
                status: "ok",
                price: thisFile.price
            }
            res.send(sendData);
            log.addStatistics(req.userId, req.sessionId, `update file price`, "success", body.id, configSQLConnection, thisFile.price)
        }
    });
    connection.end();
}

function getVariantsFromNameInData(name, prices) {
    let paper = undefined
    for (let i = 0; i < prices.length; i++){
        if(prices[i].name === name) {
            paper = prices[i].variants
            break;
        }
    }
    return paper
}

function getPriceFromCountPaper(name, prices) {
    let price = getProductInVariantsFromName(name, prices)
    let priceOfCount = 0;
    if(price !== undefined) {
        if(thisFile.realCount > 0 && thisFile.realCount < 10){
            priceOfCount = price[1]
        }
        if(thisFile.realCount > 9 && thisFile.realCount < 50){
            priceOfCount = price[2]
        }
        if(thisFile.realCount > 49 && thisFile.realCount < 100){
            priceOfCount = price[3]
        }
        if(thisFile.realCount > 99 && thisFile.realCount < 500){
            priceOfCount = price[4]
        }
        if(thisFile.realCount > 409){
            priceOfCount = price[5]
        }
    }
    return priceOfCount;
}

function getProductInVariantsFromName(name, prices) {
    let price = getPaperPricesFromUserPick(prices)
    let pricePaper = undefined
    if(price !== undefined){
        for (let i = 0; i < price.length; i++){
            if(price[i][0] === name) {
                pricePaper = price[i]
                break;
            }
        }
    }
    return pricePaper
}

function getPaperPricesFromUserPick(prices) {
    let price = undefined
    if(thisFile.format === "A4" && thisFile.color === "bw" && thisFile.sides === "one"){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "ЧБ друк A4 односторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if(thisFile.format === "A4" && thisFile.color === "bw" && thisFile.sides === "two"){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "ч/б друк А4 двосторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if(thisFile.format === "A4" && thisFile.color === "colors" && thisFile.sides === "one"){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "Колір цифровий друк А4 односторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if(thisFile.format === "A4" && thisFile.color === "colors" && thisFile.sides === "two"){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "Колір цифровий друк А4 двосторонній") {
                price = prices[i].variants
                break;
            }
        }
    }

    //experement
    if(
        thisFile.format === "A3" && thisFile.color === "bw" && thisFile.sides === "one" ||
        thisFile.format === "A5" && thisFile.color === "bw" && thisFile.sides === "one" ||
        thisFile.format === "A6" && thisFile.color === "bw" && thisFile.sides === "one" ||
        thisFile.format === "A7" && thisFile.color === "bw" && thisFile.sides === "one" ||
        thisFile.format === "custom" && thisFile.color === "bw" && thisFile.sides === "one"
    ){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "ЧБ друк A3 односторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if(
        thisFile.format === "A3" && thisFile.color === "bw" && thisFile.sides === "two" ||
        thisFile.format === "A5" && thisFile.color === "bw" && thisFile.sides === "two" ||
        thisFile.format === "A6" && thisFile.color === "bw" && thisFile.sides === "two" ||
        thisFile.format === "A7" && thisFile.color === "bw" && thisFile.sides === "two" ||
        thisFile.format === "custom" && thisFile.color === "bw" && thisFile.sides === "two"
    ){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "ч/б друк А3 двосторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if(
        thisFile.format === "A3" && thisFile.color === "colors" && thisFile.sides === "one" ||
        thisFile.format === "A5" && thisFile.color === "colors" && thisFile.sides === "one" ||
        thisFile.format === "A6" && thisFile.color === "colors" && thisFile.sides === "one" ||
        thisFile.format === "A7" && thisFile.color === "colors" && thisFile.sides === "one" ||
        thisFile.format === "custom" && thisFile.color === "colors" && thisFile.sides === "one"
    ){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "Колір цифровий друк А3 односторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if(
        thisFile.format === "A3" && thisFile.color === "colors" && thisFile.sides === "two" ||
        thisFile.format === "A5" && thisFile.color === "colors" && thisFile.sides === "two" ||
        thisFile.format === "A6" && thisFile.color === "colors" && thisFile.sides === "two" ||
        thisFile.format === "A7" && thisFile.color === "colors" && thisFile.sides === "two" ||
        thisFile.format === "custom" && thisFile.color === "colors" && thisFile.sides === "two"
    ){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "Колір цифровий друк А3 двосторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    return price
}

function getSizes(prices) {
    let size = {
        x: 0,
        y: 0
    }
    for (let i = 0; i < prices.length; i++){
        if(prices[i].name === "formats") {
            for (let o = 0; o < prices[i].variants.length; o++){
                if(prices[i].variants[o][0] === thisFile.format) {
                    size.x = prices[i].variants[o][2]
                    size.y = prices[i].variants[o][3]
                    break;
                }
            }
            break;
        }
    }
    return size
}

function getHowInASheet() {
    let xx1 = 310 / thisFile.x
    let yy1 = 440 / thisFile.y
    let gg1 = Math.floor(xx1)*Math.floor(yy1)

    xx1 = 440 / thisFile.x
    yy1 = 310 / thisFile.y
    let gg2 = Math.floor(xx1)*Math.floor(yy1)

    let forR = 0
    if(gg1 > gg2){
        forR = gg1
    } else {
        forR = gg2
    }
    return forR
}

function getPriceFromCount(name, nameService, format, prices) {
    let price = getProductInVariantsFromNameNotPaper(name, nameService, format, prices)
    console.log(price)
    let priceOfCount = 0;
    if(price !== undefined) {
        if(thisFile.realCount > 0 && thisFile.realCount < 10){
            priceOfCount = price[1]
        }
        if(thisFile.realCount > 9 && thisFile.realCount < 50){
            priceOfCount = price[2]
        }
        if(thisFile.realCount > 49 && thisFile.realCount < 100){
            priceOfCount = price[3]
        }
        if(thisFile.realCount > 99 && thisFile.realCount < 500){
            priceOfCount = price[4]
        }
        if(thisFile.realCount > 409){
            priceOfCount = price[5]
        }
    }
    return priceOfCount;
}

function getProductInVariantsFromNameNotPaper(name, nameService, format, prices) {
    let price = getVariantsFromName(nameService, format, prices)
    let pricePaper = undefined
    if(price !== undefined){
        for (let i = 0; i < price.length; i++){
            if(price[i][0] === name) {
                pricePaper = price[i]
                break;
            }
        }
    }
    return pricePaper
}

function getVariantsFromName(nameService, format, prices) {
    let price = undefined
    if(format === "A4"){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === `${nameService} А4`) {
                price = prices[i].variants
                break;
            }
        }
    }
    if(
        format === "A3" ||
        format === "A5" ||
        format === "A6" ||
        format === "A7" ||
        format === "custom"
    ){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === `${nameService} А3`) {
                price = prices[i].variants
                break;
            }
        }
    }
    else {
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === `${nameService}`) {
                price = prices[i].variants
                break;
            }
        }
    }
    return price
}


//БРОШУРУВАННЯ
function getBindingFromNameAndFormat(nameService, prices) {
    let price = undefined
    if(thisFile.format === "A4"){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === `${nameService} A4`) {
                price = prices[i].variants
                break;
            }
        }
    }
    if(
        thisFile.format === "A3"
    ){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === `${nameService} A3`) {
                price = prices[i].variants
                break;
            }
        }
    }
    return price
}
function getBindingFromPaperCount(nameService, prices) {
    let price = getBindingFromNameAndFormat(nameService, prices)
    let pricePaper = []
    if(price !== undefined){
        for (let i = 0; i < price.length; i++){
            if(thisFile.countInFile >= price[i][2] && thisFile.countInFile <= price[i][3]){
                pricePaper.push(price[i])
                // if(price[i][0] === name) {
                //     pricePaper = price[i]
                //     break;
                // }
            }
        }
    }
    return pricePaper
}

function getSize(prices) {
    let sizes = getSizes(prices)
    if (!thisFile.orient) {
        thisFile.x = sizes.x
        thisFile.y = sizes.y
    } else {
        thisFile.x = sizes.y
        thisFile.y = sizes.x
    }
}