function getDestinyInData() {
    if(thisFile.format === "A4" && thisFile.sides === "Односторонній" && thisFile.color ==="Чорно-білий"){
        return prices[3].variants
    }
    if(thisFile.format === "A3" && thisFile.sides === "Односторонній" && thisFile.color ==="Чорно-білий"){
        return prices[4].variants
    }

    if(thisFile.format === "A4" && thisFile.sides === "Односторонній" && thisFile.color ==="Кольоровий"){
        return prices[5].variants
    }
    if(thisFile.format === "A4" && thisFile.sides === "Двосторонній" && thisFile.color ==="Кольоровий"){
        return prices[6].variants
    }
    if(thisFile.format === "A3" && thisFile.sides === "Односторонній" && thisFile.color ==="Кольоровий"){
        return prices[7].variants
    }
    if(thisFile.format === "A3" && thisFile.sides === "Двосторонній" && thisFile.color ==="Кольоровий"){
        return prices[8].variants
    }

    if(thisFile.format === "Свій розмір" && thisFile.sides === "Односторонній" && thisFile.color ==="Кольоровий"){
        return prices[7].variants
    }
    if(thisFile.format === "Свій розмір" && thisFile.sides === "Двосторонній" && thisFile.color ==="Кольоровий"){
        return prices[8].variants
    }
}

function getBindingInData() {
    let ret = [];
    if(thisFile.format === "A4"){
        prices[11].variants.forEach(e => {
            if(thisFile._count >= e[2] && thisFile._count <= e[3]){
                ret.push(e)
            }
        })
    }
    if(thisFile.format === "A3"){
        prices[12].variants.forEach(e => {
            if(thisFile._count >= e[2] && thisFile._count <= e[3]){
                ret.push(e)
            }
        })
    }
    return ret;
}

function getDestinyPrice(count){
    if(count < 11){
        let price = getDestinyInData()
        let ret = 0
        price.forEach(e => {
            if(e[0] === thisFile.destiny){
                ret = e[1]
            }
        })
        return ret
    }
    if(count > 10 && count < 51){
        let price = getDestinyInData()
        let ret = 0
        price.forEach(e => {
            if(e[0] === thisFile.destiny){
                ret = e[2]
            }
        })
        return ret
    }
    if(count > 50 && count < 101){
        let price = getDestinyInData()
        let ret = 0
        price.forEach(e => {
            if(e[0] === thisFile.destiny){
                ret = e[3]
            }
        })
        return ret
    }
    if(count > 100){
        let price = getDestinyInData()
        let ret = 0
        price.forEach(e => {
            if(e[0] === thisFile.destiny){
                ret = e[4]
            }
        })
        return ret
    }
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