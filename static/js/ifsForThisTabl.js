function getVariantsFromNameInData(name) {
    let paper = undefined
    for (let i = 0; i < prices.length; i++){
        if(prices[i].name === name) {
            paper = prices[i].variants
            break;
        }
    }
    return paper
}

function getPriceFromCount(name) {
    let price = getPriceFromPaper(name)
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

function getPriceFromPaper(name) {
    let price = getPricesFromUserPick()
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

function getPricesFromUserPick() {
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
        thisFile.format === "Свій розмір" && thisFile.color === "bw" && thisFile.sides === "one"
    ){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "Колір цифровий друк А3 односторонній") {
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
        thisFile.format === "Свій розмір" && thisFile.color === "bw" && thisFile.sides === "two"
    ){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "Колір цифровий друк А3 односторонній") {
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
        thisFile.format === "Свій розмір" && thisFile.color === "colors" && thisFile.sides === "one"
    ){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "Колір цифровий друк А3 двосторонній") {
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
        thisFile.format === "Свій розмір" && thisFile.color === "colors" && thisFile.sides === "two"
    ){
        for (let i = 0; i < prices.length; i++){
            if(prices[i].name === "ч/б друк А3 двосторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    return price
}

function getSizes() {
    let size = {
        x: 0,
        y: 0
    }
    if(thisFile.format === "A4"){
        size = {
            x: prices[0].variants[2][2],
            y: prices[0].variants[2][3]
        }
    }
    if(thisFile.format === "A3"){
        size = {
            x: prices[0].variants[3][2],
            y: prices[0].variants[3][3]
        }
    }
    if(thisFile.format === "A5"){
        size = {
            x: prices[0].variants[1][2],
            y: prices[0].variants[1][3]
        }
    }
    if(thisFile.format === "A6"){
        size = {
            x: prices[0].variants[0][2],
            y: prices[0].variants[0][3]
        }
    }
    if(thisFile.format === "A7"){
        size = {
            x: prices[0].variants[4][2],
            y: prices[0].variants[4][3]
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