function renderWideCalc(priceCalc){
    // let sss = Math.ceil(this._count*this.countInFile / getHowInASheet())
    // let paperPrice = getPriceFromCountPaper(thisFile.destiny)
    // let laminationPrice = getPriceFromCount(thisFile.lamination, "Ламінування", thisFile.format)
    // if(!isNaN(paperPrice) && paperPrice !== undefined){
    //     priceCalc = paperPrice*sss;
    // }
    // if(!isNaN(laminationPrice) && laminationPrice !== undefined){
    //     let lamPrice = laminationPrice*sss
    //     priceCalc = priceCalc + lamPrice;
    // }

    let paper1 = getVariantsFromNameInData(thisFile.touse);
    let paper2 = getVariantsFromNameInData(thisFile.destiny);

    thisFile.realCount = thisFile._count*thisFile.countInFile

    if(paper1 !== undefined){
        let mm = thisFile.x * thisFile.y
        let m2kv = mm/1000000
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


        price.value = priceCalc
    }

    toUseButtons.innerHTML = ""
    if(getVariantsFromNameInData("Використання") !== undefined){
        toUseButtons.classList.remove("d-none")
        getVariantsFromNameInData("Використання").forEach(e => {
            let elem = document.createElement("div")
            elem.innerText = e[0]
            elem.classList.add("btn")
            elem.addEventListener("click", function () {
                thisFile.touse = elem.innerText
                thisFile.renderSettings()
            })
            if(e[0] === thisFile.touse){
                elem.classList.add("btnm-act")
            }
            toUseButtons.appendChild(elem)
        })
    }
    destinyButtons.innerHTML = ""
    if(getVariantsFromNameInData(thisFile.touse) !== undefined){
        destinyButtons.classList.remove("d-none")
        getVariantsFromNameInData(thisFile.touse).forEach(e => {
            let elem = document.createElement("div")
            elem.innerText = e[0]
            elem.classList.add("btn")
            elem.addEventListener("click", function () {
                thisFile.destiny = elem.innerText
                thisFile.renderSettings()
            })
            if(e[0] === thisFile.destiny){
                elem.classList.add("btnm-act")
            }
            destinyButtons.appendChild(elem)
        })
    }
    destinyThisButtons.innerHTML = ""
    if(getVariantsFromNameInData(thisFile.destiny) !== undefined){
        destinyThisButtons.classList.remove("d-none")
        getVariantsFromNameInData(thisFile.destiny).forEach(e => {
            let elem = document.createElement("div")
            elem.innerText = e[0]
            elem.classList.add("btn")
            elem.addEventListener("click", function () {
                thisFile.destinyThis = elem.innerText
                thisFile.renderSettings()
            })
            if(e[0] === thisFile.destinyThis){
                elem.classList.add("btnm-act")
            }
            destinyThisButtons.appendChild(elem)
        })
    }


    luvers.innerHTML = ""
    bannerVarit.innerHTML = ""
    floorLamination.innerHTML = ""
    widthLamination.innerHTML = ""
    if(getVariantsFromNameInData(`Доп ${thisFile.destiny}`) !== undefined){
        luvers.classList.remove("d-none")
        bannerVarit.classList.remove("d-none")
        floorLamination.classList.remove("d-none")
        widthLamination.classList.remove("d-none")
        getVariantsFromNameInData(`Доп ${thisFile.destiny}`).forEach(e => {
            if(e[0] === "Встановлення люверсов"){
                let variants = getVariantsFromNameInData(`Встановлення люверсов`);
                if(variants !== undefined){
                    variants.forEach(option => {
                        let elem = document.createElement("div")
                        elem.innerText = option[0]
                        elem.classList.add("btn")
                        elem.addEventListener("click", function () {
                            thisFile.luvers = elem.innerText
                            thisFile.renderSettings()
                        })
                        if(option[0] === thisFile.luvers){
                            elem.classList.add("btnm-act")
                        }
                        luvers.appendChild(elem)
                    })
                }
            }
            if(e[0] === "Проварювання банера"){
                let variants = getVariantsFromNameInData(`Проварювання банера`);
                if(variants !== undefined){
                    variants.forEach(option => {
                        let elem = document.createElement("div")
                        elem.innerText = option[0]
                        elem.classList.add("btn")
                        elem.addEventListener("click", function () {
                            thisFile.bannerVarit = elem.innerText
                            thisFile.renderSettings()
                        })
                        if(option[0] === thisFile.bannerVarit){
                            elem.classList.add("btnm-act")
                        }
                        bannerVarit.appendChild(elem)
                    })
                }
            }
            if(e[0] === "Напольне ламінування"){
                let variants = getVariantsFromNameInData(`Напольне ламінування`);
                if(variants !== undefined){
                    variants.forEach(option => {
                        let elem = document.createElement("div")
                        elem.innerText = option[0]
                        elem.classList.add("btn")
                        elem.addEventListener("click", function () {
                            thisFile.floorLamination = elem.innerText
                            thisFile.renderSettings()
                        })
                        if(option[0] === thisFile.floorLamination){
                            elem.classList.add("btnm-act")
                        }
                        floorLamination.appendChild(elem)
                    })
                }
            }
            if(e[0] === "Ламінування"){
                let variants = getVariantsFromNameInData(`Ламінування`);
                if(variants !== undefined){
                    variants.forEach(option => {
                        let elem = document.createElement("div")
                        elem.innerText = option[0]
                        elem.classList.add("btn")
                        elem.addEventListener("click", function () {
                            thisFile.widthLamination = elem.innerText
                            thisFile.renderSettings()
                        })
                        if(option[0] === thisFile.widthLamination){
                            elem.classList.add("btnm-act")
                        }
                        widthLamination.appendChild(elem)
                    })
                }
            }
        })
    }
}