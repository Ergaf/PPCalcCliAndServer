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
    //
    thisFile.realCount = thisFile._count*thisFile.countInFile
    //
    // let mm = thisFile.x * thisFile.y
    // let m2kv = mm/1000000
    //
    // if(paper1 !== undefined){
    //     if(paper2 !== undefined){
    //         for (let i = 0; i < paper2.length; i++) {
    //             if(thisFile.destinyThis === paper2[i][0]){
    //                 priceCalc = paper2[i][1] * m2kv * thisFile.realCount
    //             }
    //         }
    //     }
    //     else {
    //         for (let i = 0; i < paper1.length; i++) {
    //             if(thisFile.destiny === paper1[i][0]){
    //                 priceCalc = paper1[i][1] * m2kv * thisFile.realCount
    //             }
    //         }
    //     }
    // }

    // price.value = thisFile.price

    toUseButtons.innerHTML = ""
    renderOptions("Використання", "touse", toUseButtons)
    destinyButtons.innerHTML = ""
    renderOptions(thisFile.touse, "destiny", destinyButtons)
    destinyThisButtons.innerHTML = ""
    renderOptions(thisFile.destiny, "destinyThis", destinyThisButtons)
    destinyThisButtons.classList.remove("d-none")

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
                    if(thisFile.luvers === undefined){
                        thisFile.luvers = "без люверсов"
                    }
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
                    if(thisFile.bannerVarit === undefined){
                        thisFile.bannerVarit = "без проварювання"
                    }
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
                    if(thisFile.floorLamination === undefined){
                        thisFile.floorLamination = "без ламінування"
                    }
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

                            // let PriceToSum = option[1] * m2kv * thisFile.realCount
                            // priceCalc = priceCalc + PriceToSum

                        }
                        floorLamination.appendChild(elem)
                    })
                }
            }
            if(e[0] === "Ламінування"){
                let variants = getVariantsFromNameInData(`Ламінування`);
                if(variants !== undefined){
                    if(thisFile.widthLamination === undefined){
                        thisFile.widthLamination = "без ламінування"
                    }
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

                            // let PriceToSum = option[1] * m2kv * thisFile.realCount
                            // priceCalc = priceCalc + PriceToSum

                        }
                        widthLamination.appendChild(elem)
                    })
                }
            }
        })
    }
    // this.price = priceCalc
    // price.value = priceCalc
}