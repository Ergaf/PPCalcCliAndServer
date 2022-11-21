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
    console.log(priceCalc);
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
    if(getVariantsFromNameInData("на чому друк") !== undefined){
        getVariantsFromNameInData("на чому друк").forEach(e => {
            if(e[0][0] !== "!"){
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btn")
                elem.setAttribute("toFile", e[0])
                elem.addEventListener("click", function () {
                    thisFile.paper = elem.getAttribute("toFile")
                    thisFile.renderSettings()
                })
                if(e[0] === thisFile.paper){
                    elem.classList.add("btnm-act")
                }
                paperButtons.appendChild(elem)
            }
        })
    }


    if(getVariantsFromNameInData(thisFile.paper) !== undefined){
        getVariantsFromNameInData(thisFile.paper).forEach(e => {
            if(e[0][0] !== "!"){
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
            }
        })
    }
    if(thisFile.paper === "на папері"){
        accordionOptions.classList.remove("d-none")
        thisFile.stickerCutting = undefined
        thisFile.stickerCuttingThis = undefined


        if(getVariantsFromNameInData("згиби") !== undefined){
            if(thisFile.big === undefined){
                thisFile.big = "без згинання"
            }
            getVariantsFromNameInData("згиби").forEach(e => {
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btn")
                elem.addEventListener("click", function () {
                    thisFile.big = elem.innerText
                    thisFile.renderSettings()
                })
                if(e[0] === thisFile.big){
                    elem.classList.add("btnm-act")
                }
                bigButtons.appendChild(elem)
            })
        }
        if(getVariantsFromNameInData("отвір") !== undefined){
            if(thisFile.holes === undefined){
                thisFile.holes = "без отворів"
            }
            getVariantsFromNameInData("отвір").forEach(e => {
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btn")
                elem.addEventListener("click", function () {
                    thisFile.holes = elem.innerText
                    thisFile.renderSettings()
                })
                if(e[0] === thisFile.holes){
                    elem.classList.add("btnm-act")
                }
                holesButtons.appendChild(elem)
            })
        }
        if(getVariantsFromNameInData("кути") !== undefined){
            if(thisFile.roundCorner === undefined){
                thisFile.roundCorner = "без обрізки кутів"
            }
            getVariantsFromNameInData("кути").forEach(e => {
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btn")
                elem.addEventListener("click", function () {
                    thisFile.roundCorner = elem.innerText
                    thisFile.renderSettings()
                })
                if(e[0] === thisFile.roundCorner){
                    elem.classList.add("btnm-act")
                }
                roundCornerButtons.appendChild(elem)
            })
        }


        if(getVariantsFromNameInData("ламінування") !== undefined){
            if(thisFile.lamination === undefined){
                thisFile.lamination = "без ламінації"
            }
            getVariantsFromNameInData("ламінування").forEach(e => {
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btn")
                elem.addEventListener("click", function () {
                    thisFile.lamination = elem.innerText
                    thisFile.renderSettings()
                })
                if(e[0] === thisFile.lamination){
                    elem.classList.add("btnm-act")
                }
                laminationButtons.appendChild(elem)
            })
        }
        if(getBindingFromPaperCount("брошурування") !== undefined){
            if(thisFile.binding === undefined){
                thisFile.binding = "без брошурування"
            }
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
        if(getVariantsFromNameInData(thisFile.binding) !== undefined){
            getVariantsFromNameInData(thisFile.binding).forEach(e => {
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btn")
                elem.addEventListener("click", function () {
                    thisFile.bindingSelect = elem.innerText
                    thisFile.renderSettings()
                })
                if(e[0] === thisFile.bindingSelect){
                    elem.classList.add("btnm-act")
                }
                bindingSelectButtons.appendChild(elem)
            })
        }
        if(this.binding === "на пластикову" || thisFile.binding === "на металеву"){
            backLiningText.classList.remove("nonDisplay");
            frontLiningButtons.classList.remove("nonDisplay");
            backLiningButtons.classList.remove("nonDisplay");
            if(thisFile.bindingSelect !== undefined){
                if(thisFile.cower === undefined){
                    thisFile.cower = "без обкладинки"
                }
                if(getVariantsFromNameInData("обкладинка") !== undefined){
                    if(thisFile.cower === undefined){
                        thisFile.cower = "без обкладинки"
                    }
                    getVariantsFromNameInData("обкладинка").forEach(e => {
                        let elem = document.createElement("div")
                        elem.innerText = e[0]
                        elem.classList.add("btn")
                        elem.addEventListener("click", function () {
                            thisFile.cower = elem.innerText
                            thisFile.renderSettings()
                        })
                        if(e[0] === thisFile.cower){
                            elem.classList.add("btnm-act")
                        }
                        cowerButtons.appendChild(elem)
                    })
                }

                backLiningText.innerText = "з задньою подкладкою"
                if(thisFile.frontLining === undefined){
                    thisFile.frontLining = "з прозорою лицьовою підкладкою"
                }
                if(getVariantsFromNameInData("лицьова підкладка") !== undefined){
                    getVariantsFromNameInData("лицьова підкладка").forEach(e => {
                        let elem = document.createElement("div")
                        elem.innerText = e[0]
                        elem.classList.add("btn")
                        elem.addEventListener("click", function () {
                            thisFile.frontLining = elem.innerText
                            thisFile.renderSettings()
                        })
                        if(e[0] === thisFile.frontLining){
                            elem.classList.add("btnm-act")
                        }
                        frontLiningButtons.appendChild(elem)
                    })
                }
                if(thisFile.backLining === undefined){
                    thisFile.backLining = ""
                }
                if(getVariantsFromNameInData("задньою підкладкою") !== undefined){
                    getVariantsFromNameInData("задньою підкладкою").forEach(e => {
                        let elem = document.createElement("div")
                        elem.innerText = e[0]
                        elem.classList.add("btn")
                        elem.addEventListener("click", function () {
                            thisFile.backLining = elem.innerText
                            thisFile.renderSettings()
                        })
                        if(e[0] === thisFile.backLining){
                            elem.classList.add("btnm-act")
                        }
                        backLiningButtons.appendChild(elem)
                    })
                }

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

        if(getVariantsFromNameInData("порізка самоклейки") !== undefined){
            if(thisFile.stickerCutting === undefined){
                thisFile.stickerCutting = "без порізки"
            }
            getVariantsFromNameInData("порізка самоклейки").forEach(e => {
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btn")
                elem.addEventListener("click", function () {
                    thisFile.stickerCutting = elem.innerText
                    thisFile.renderSettings()
                })
                if(e[0] === thisFile.stickerCutting){
                    elem.classList.add("btnm-act")
                }
                stickerCutting.appendChild(elem)
            })
        }

        if(getVariantsFromNameInData(thisFile.stickerCutting) !== undefined){
            // if(this.stickerCuttingThis === undefined){
            //     this.stickerCuttingThis = "без порізки"
            // }
            getVariantsFromNameInData(thisFile.stickerCutting).forEach(e => {
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btn")
                elem.addEventListener("click", function () {
                    thisFile.stickerCuttingThis = elem.innerText
                    thisFile.renderSettings()
                })
                if(e[0] === thisFile.stickerCuttingThis){
                    elem.classList.add("btnm-act")
                }
                stickerCuttingThis.appendChild(elem)
            })
        }

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