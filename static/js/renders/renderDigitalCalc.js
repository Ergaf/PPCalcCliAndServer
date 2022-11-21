function renderDigitalCalc(priceCalc){
    if(thisFile.format === "A4" || thisFile.format === "A3"){
        thisFile.realCount = thisFile._count*thisFile.countInFile
        let paperPrice = getPriceFromCountPaper(thisFile.destiny)
        let laminationPrice = getPriceFromCount(thisFile.lamination, "Ламінування", thisFile.format)
        if(!isNaN(paperPrice) && paperPrice !== undefined){
            priceCalc = paperPrice*thisFile.realCount
        }
        if(!isNaN(laminationPrice) && laminationPrice !== undefined){
            let lamPrice = laminationPrice*thisFile.realCount
            priceCalc = priceCalc + lamPrice
        }
    }
    else {
        let sss = Math.ceil(thisFile._count*thisFile.countInFile / getHowInASheet())
        this.realCount = sss
        let paperPrice = getPriceFromCountPaper(thisFile.destiny)
        let laminationPrice = getPriceFromCount(thisFile.lamination, "Ламінування", thisFile.format)
        if(!isNaN(paperPrice) && paperPrice !== undefined){
            priceCalc = paperPrice*sss;
        }
        if(!isNaN(laminationPrice) && laminationPrice !== undefined){
            let lamPrice = laminationPrice*sss
            priceCalc = priceCalc + lamPrice;
        }
    }
    let bigPrice = getPriceFromCount(thisFile.big, "згиби")*thisFile.allPaperCount
    let holesPrice = getPriceFromCount(thisFile.holes, "отвір")*thisFile.allPaperCount
    let roundCornerPrice = getPriceFromCount(thisFile.roundCorner, "кути")*thisFile.allPaperCount
    let cowerPrice = getPriceFromCount(thisFile.cower, "обкладинка")*thisFile.allPaperCount



    let bindingPrice = getBindingFromPaperCount("брошурування").filter(e => e[0] === thisFile.binding)

    priceCalc = priceCalc + bigPrice
    priceCalc = priceCalc + holesPrice
    priceCalc = priceCalc + roundCornerPrice
    priceCalc = priceCalc + cowerPrice
    if(bindingPrice[0]){
        priceCalc = priceCalc + bindingPrice[0][1]
    }
    price.value = priceCalc

    destinyButtons.innerHTML = ""
    roundCornerButtons.innerHTML = ""
    roundCornerButtons.classList.remove("d-none")
    holesButtons.innerHTML = ""
    holesButtons.classList.remove("d-none")
    bigButtons.innerHTML = ""
    bigButtons.classList.remove("d-none")
    laminationButtons.innerHTML = ""
    laminationButtons.classList.remove("d-none")
    bindingSelectButtons.innerHTML = ""
    bindingSelectButtons.classList.remove("d-none")
    bindingButtons.innerHTML = ""
    bindingButtons.classList.remove("d-none")
    cowerButtons.innerHTML = ""
    cowerButtons.classList.remove("d-none")
    frontLiningButtons.innerHTML = ""
    frontLiningButtons.classList.remove("d-none")
    backLiningButtons.innerHTML = ""
    backLiningButtons.classList.remove("d-none")

    stickerCutting.innerHTML = ""
    stickerCutting.classList.remove("d-none")
    stickerCuttingThis.innerHTML = ""
    stickerCuttingThis.classList.remove("d-none")

    backLiningText.innerText = ""
    backLiningText.classList.remove("d-none")
    paperButtons.innerHTML = ""

    renderOptions("на чому друк", "paper", paperButtons)
    renderOptions(thisFile.paper, "destiny", destinyButtons)

    if(thisFile.paper === "на папері"){
        accordionOptions.classList.remove("d-none")
        thisFile.stickerCutting = undefined
        thisFile.stickerCuttingThis = undefined

        if(thisFile.big === undefined){
            thisFile.big = "без згинання"
        }
        renderOptions("згиби", "big", bigButtons)
        if(thisFile.holes === undefined){
            thisFile.holes = "без отворів"
        }
        renderOptions("отвір", "holes", holesButtons)
        if(thisFile.roundCorner === undefined){
            thisFile.roundCorner = "без обрізки кутів"
        }
        renderOptions("кути", "roundCorner", roundCornerButtons)
        if(thisFile.lamination === undefined){
            thisFile.lamination = "без ламінації"
        }
        renderOptions("ламінування", "lamination", laminationButtons)

        if(thisFile.binding === undefined){
            thisFile.binding = "без брошурування"
        }
        if(getBindingFromPaperCount("брошурування") !== undefined){
            getBindingFromPaperCount("брошурування").forEach(e => {
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btn")
                if(e[0] === "на пластикову" || e[0] === "на металеву" || e[0] === "прошивка дипломних робіт"){
                    elem.addEventListener("click", function () {
                        thisFile.bindingSelect = undefined
                        thisFile.cower = undefined
                        thisFile.binding = elem.innerText
                        thisFile.renderSettings()
                    })
                }
                else {
                    elem.addEventListener("click", function () {
                        thisFile.binding = elem.innerText
                        thisFile.bindingSelect = undefined
                        thisFile.cower = undefined
                        thisFile.renderSettings()
                    })
                }
                if(e[0] === thisFile.binding){
                    elem.classList.add("btnm-act")
                }
                bindingButtons.appendChild(elem)
            })
        }

        renderOptions(thisFile.binding, "bindingSelect", bindingSelectButtons)


        if(thisFile.binding === "на пластикову" || thisFile.binding === "на металеву"){
            backLiningText.classList.remove("nonDisplay");
            frontLiningButtons.classList.remove("nonDisplay");
            backLiningButtons.classList.remove("nonDisplay");
            if(thisFile.bindingSelect !== undefined){
                if(thisFile.cower === undefined){
                    thisFile.cower = "без обкладинки"
                }
                renderOptions("обкладинка", "cower", cowerButtons)

                backLiningText.innerText = "з задньою подкладкою"
                if(thisFile.frontLining === undefined){
                    thisFile.frontLining = "з прозорою лицьовою підкладкою"
                }
                renderOptions("лицьова підкладка", "frontLining", frontLiningButtons)

                if(thisFile.backLining === undefined){
                    thisFile.backLining = ""
                }

                renderOptions("задньою підкладкою", "backLining", backLiningButtons)
            }
        }
    }
    else if(thisFile.paper === "на самоклейці"){
        accordionOptions.classList.remove("d-none")
        thisFile.lamination = undefined
        thisFile.bindingSelect = undefined
        thisFile.binding = undefined
        thisFile.cower = undefined
        thisFile.frontLining = undefined
        thisFile.backLining = undefined
        thisFile.big = undefined
        thisFile.holes = undefined
        thisFile.roundCorner = undefined

        if(thisFile.stickerCutting === undefined){
            thisFile.stickerCutting = "без порізки"
        }
        renderOptions("порізка самоклейки", "stickerCutting", stickerCutting)
        renderOptions(thisFile.stickerCutting, "stickerCuttingThis", stickerCuttingThis)
    }
    else {
        accordionOptions.classList.add("d-none")
        thisFile.lamination = undefined
        thisFile.bindingSelect = undefined
        thisFile.binding = undefined
        thisFile.cower = undefined
        thisFile.frontLining = undefined
        thisFile.backLining = undefined
        thisFile.big = undefined
        thisFile.holes = undefined
        thisFile.roundCorner = undefined
        thisFile.stickerCutting = undefined
    }
}