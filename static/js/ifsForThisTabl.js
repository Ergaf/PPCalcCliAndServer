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

function getPriceFromCountPaper(name) {
    let price = getProductInVariantsFromName(name)
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

function getProductInVariantsFromName(name) {
    let price = getPaperPricesFromUserPick()
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

function getPaperPricesFromUserPick() {
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

function getSizes() {
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

function getPriceFromCount(name, nameService, format) {
    let price = getProductInVariantsFromNameNotPaper(name, nameService, format)
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

function getProductInVariantsFromNameNotPaper(name, nameService, format) {
    let price = getVariantsFromName(nameService, format)
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

function getVariantsFromName(nameService, format) {
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
function getBindingFromNameAndFormat(nameService) {
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
function getBindingFromPaperCount(nameService) {
    let price = getBindingFromNameAndFormat(nameService)
    let pricePaper = []
    if(price !== undefined){
        for (let i = 0; i < price.length; i++){
            if(thisFile.allPaperCount >= price[i][2] && thisFile.allPaperCount <= price[i][3]){
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