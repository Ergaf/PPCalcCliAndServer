class file {
    container;
    nameContainer;
    format;
    sides;
    color;
    cower;
    paper;
    destiny;
    binding;
    bindingSelect;
    lamination;
    roundCorner;
    frontLining;
    backLining;
    big;
    holes;
    realCount;
    countInFile;
    allPaperCount;
    orient;
    stickerCutting;
    stickerCuttingThis;
    x;
    y;
    url;
    url2;
    list;
    constructor (name, id) {
        this._name = name;
        this._id = id;
        this._count = 1
        this.orient = false
        this.list = {
            scale: false,
            position: false
        }
        this.url2 = {
            pdf: null,
            currentPage: 1,
            zoom: 1
        }
    }
    createFileContainer() {
        //create item and bind this object to this DOM element // query filesContainer
        let filesAllContainer = document.querySelector('.FilesContainer');
        let Item = document.createElement('div');
        this.container = Item;

        Item.classList.add('btn');
        // Item.classList.add('btn-outline-dark');
        // Item.classList.add('align-items-center');
        Item.style.cssText = "display: flex; transition: 0.5s;"
        filesAllContainer.appendChild(Item);
        Item.onmousedown = this.pick.bind( this);
        Item.innerHTML = this._name;

        let cancelButton = document.createElement('div');
        cancelButton.onmousedown = this.deleteThis.bind( this);
        cancelButton.classList.add('btn-close');
        Item.appendChild(cancelButton);
    }

    pick(e){
        if(e.target === this.container || e.target === this.nameContainer){
            allFiles.forEach(e => {
                if(e._id !== this._id){
                    e.removePick()
                }
            })
            this.container.classList.add("btnm-act")
            thisFile = this
            this.renderSettings()
            document.querySelector(".settingsContainer").style.display = "flex"
        }
    }
    removePick() {
        this.container.classList.remove("btnm-act")
    }
    deleteThis() {
        sendData("/orders", "DELETE", JSON.stringify({id: this._id})).then(e => {
            console.log(e);
            if(e.toString() === this._id.toString()){
                if(thisFile === this){
                    document.querySelector(".settingsContainer").style.display = "none"
                }
                for (let i = 0; i < allFiles.length; i++){
                    if(allFiles[i]._id === this._id){
                        allFiles[i].container.remove()
                        allFiles.splice(i, 1)
                    }
                }
            }
        })
    }

    renderSettings() {
        // console.log(thisFile);
        this.allPaperCount = this.countInFile*thisFile._count
        if(this.format !== "custom"){
            this.getSize()
        }
        else {
            thisFile.orient = false
        }
        sizeX.value = this.x
        sizeY.value = this.y

        let priceCalc = 0;
        if(this.format === "A4" || this.format === "A3"){
            this.realCount = this._count*this.countInFile
            let paperPrice = getPriceFromCountPaper(thisFile.destiny)
            let laminationPrice = getPriceFromCount(thisFile.lamination, "Ламінування", thisFile.format)
            if(!isNaN(paperPrice) && paperPrice !== undefined){
                priceCalc = paperPrice*this.realCount
            }
            if(!isNaN(laminationPrice) && laminationPrice !== undefined){
                let lamPrice = laminationPrice*this.realCount
                priceCalc = priceCalc + lamPrice
            }
        }
        else {
            let sss = Math.ceil(this._count*this.countInFile / getHowInASheet())
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
        let bigPrice = getPriceFromCount(thisFile.big, "згиби")*this.allPaperCount
        let holesPrice = getPriceFromCount(thisFile.holes, "отвір")*this.allPaperCount
        let roundCornerPrice = getPriceFromCount(thisFile.roundCorner, "кути")*this.allPaperCount
        let cowerPrice = getPriceFromCount(thisFile.cower, "обкладинка")*this.allPaperCount



        let bindingPrice = getBindingFromPaperCount("брошурування").filter(e => e[0] === this.binding)


        priceCalc = priceCalc + bigPrice
        priceCalc = priceCalc + holesPrice
        priceCalc = priceCalc + roundCornerPrice
        priceCalc = priceCalc + cowerPrice
        if(bindingPrice[0]){
            priceCalc = priceCalc + bindingPrice[0][1]
        }

        realCount.value = this.realCount
        countInt.value = this._count
        countInFile.value = this.countInFile
        allPaper.value = this.allPaperCount

        destinyButtons.innerHTML = ""
        roundCornerButtons.innerHTML = ""
        holesButtons.innerHTML = ""
        bigButtons.innerHTML = ""
        laminationButtons.innerHTML = ""
        bindingSelectButtons.innerHTML = ""
        bindingButtons.innerHTML = ""
        cowerButtons.innerHTML = ""
        frontLiningButtons.innerHTML = ""
        backLiningButtons.innerHTML = ""

        stickerCutting.innerHTML = ""
        stickerCuttingThis.innerHTML = ""



        backLiningText.innerText = ""

        if(this._count < 2){
            primirnyk.innerText = "примірник"
        }
        if(this._count > 1 && this._count < 5){
            primirnyk.innerText = "примірника"
        }
        if(this._count > 4){
            primirnyk.innerText = "примірників"
        }

        if(this.realCount < 2){
            arkushi.innerText = "аркуш"
        }
        if(this.realCount > 1 && this._count < 5){
            arkushi.innerText = "аркуша"
        }
        if(this.realCount > 4){
            arkushi.innerText = "аркушів"
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
        if(this.paper === "на папері"){
            accordionOptions.classList.remove("d-none")
            thisFile.stickerCutting = undefined
            thisFile.stickerCuttingThis = undefined


            if(getVariantsFromNameInData("згиби") !== undefined){
                if(this.big === undefined){
                    this.big = "без згинання"
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
                if(this.holes === undefined){
                    this.holes = "без отворів"
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
                if(this.roundCorner === undefined){
                    this.roundCorner = "без обрізки кутів"
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
                if(this.lamination === undefined){
                    this.lamination = "без ламінації"
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
                if(this.binding === undefined){
                    this.binding = "без брошурування"
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
            if(getVariantsFromNameInData(this.binding) !== undefined){
                getVariantsFromNameInData(this.binding).forEach(e => {
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
            if(this.binding === "на пластикову" || this.binding === "на металеву"){
                backLiningText.classList.remove("nonDisplay");
                frontLiningButtons.classList.remove("nonDisplay");
                backLiningButtons.classList.remove("nonDisplay");
                if(this.bindingSelect !== undefined){
                    if(this.cower === undefined){
                        this.cower = "без обкладинки"
                    }
                    if(getVariantsFromNameInData("обкладинка") !== undefined){
                        if(this.cower === undefined){
                            this.cower = "без обкладинки"
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
                        if(this.frontLining === undefined){
                            this.frontLining = "з прозорою лицьовою підкладкою"
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
                        if(this.backLining === undefined){
                            this.backLining = ""
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
        else if(this.paper === "на самоклейці"){
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
                if(this.stickerCutting === undefined){
                    this.stickerCutting = "без порізки"
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

            if(getVariantsFromNameInData(this.stickerCutting) !== undefined){
                // if(this.stickerCuttingThis === undefined){
                //     this.stickerCuttingThis = "без порізки"
                // }
                getVariantsFromNameInData(this.stickerCutting).forEach(e => {
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
        Array.prototype.slice.call(formatButtons.children).forEach(e => {
            if(e.getAttribute("toFile") === this.format){
                e.classList.add("btnm-act")
            }
            else {
                e.classList.remove("btnm-act")
            }
        })
        Array.prototype.slice.call(sidesButtons.children).forEach(e => {
            if(e.getAttribute("toFile") === this.sides){
                e.classList.add("btnm-act")
            }
            else {
                e.classList.remove("btnm-act")
            }
        })
        Array.prototype.slice.call(colorButtons.children).forEach(e => {
            if(e.getAttribute("toFile") === this.color){
                e.classList.add("btnm-act")
            }
            else {
                e.classList.remove("btnm-act")
            }
        })
        Array.prototype.slice.call(paperButtons.children).forEach(e => {
            if(e.getAttribute("toFile") === this.paper){
                e.classList.add("btnm-act")
            }
            else {
                e.classList.remove("btnm-act")
            }
        })

        renderListAndCard()
        if(thisFile.url){
            // if(thisFile.url.ext === 1){
            //     imgInServer.setAttribute("src", "/files/"+thisFile.url.url);
            // }
            // else {
            //     imgInServer.setAttribute("src", "/files/"+thisFile.url.url+thisFile.url.readdir[thisFile.url.pag])
            // }
            // pagenation.innerText = `${thisFile.url.pag+1}/${thisFile.url.count}`

            console.log(thisFile.url);
            if(thisFile.url.img){
                let image = new Image();
                image.onload = function(){
                    imgInServer.setAttribute("src", image.src)
                    renderListAndCard()
                }
                image.src = thisFile.url.url;

                containerForImgInServer.classList.remove("d-none")
                containerForPdfInServer.classList.add("d-none")
                // imgInServer.setAttribute("src", image.src)
                document.querySelector("#page_count").innerText = 1
            }
            else {
                imgInServer.setAttribute("src", "")
                containerForImgInServer.classList.add("d-none")
                containerForPdfInServer.classList.remove("d-none")
                if(!this.url2.pdf){
                    pdfjsLib.getDocument(thisFile.url.url).then((pdf) => {
                        this.url2.pdf = pdf
                        render();
                    })
                }
            }
        }
        else {
            imgInServer.setAttribute("src", "")
            containerForImgInServer.classList.add("d-none")
            containerForPdfInServer.classList.remove("d-none")
            if(!this.url2.pdf){
                pdfjsLib.getDocument("/files/totest/file1.pdf").then((pdf) => {
                    this.url2.pdf = pdf
                    render();
                })
            }
        }


        price.value = priceCalc
        text.innerText = this.format
            +", "
            +this.color
            +" color, "
            +this.sides
            +" sides, "
            +this.paper
            +" "
            +this.destiny
            +", "
            +this.lamination
            +", "
            +this.binding
            +", "
            +this.bindingSelect
            +", "
            +this.cower
            +", "
            +this.frontLining
            +", "
            +", "
            +", "
            +this.backLining
            +", "
            +this.frontLining
            +", "
            +this.big
            +", "
            +this.holes
            +", "
            +this.roundCorner
    }

    // destinyAppend() {
    //     getDestinyInData().forEach(e => {
    //         let opt = document.createElement("option")
    //         opt.innerText = e[0]
    //         opt.value = e[0]
    //         destinySelect.appendChild(opt)
    //     })
    // }

    // bindingAppend() {
    //     getBindingInData().forEach(e => {
    //         let opt = document.createElement("option")
    //         opt.innerText = e[0]
    //         opt.value = e[0]
    //         // bindingSelect.appendChild(opt)
    //     })
    // }

    renderOptions(thisFilePaper, thisFileProp, renderIn){
        if(getVariantsFromNameInData(thisFile.paper) !== undefined){
            getVariantsFromNameInData(thisFile.paper).forEach(e => {
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btn")
                elem.addEventListener("click", function () {
                    console.log(this[thisFileProp]);
                    this[thisFileProp] = elem.innerText
                    thisFile.renderSettings()
                })
                if(e[0] === this[thisFileProp]){
                    elem.classList.add("btnm-act")
                }
                renderIn.appendChild(elem)
            })
        }
    }

    getSize() {
        let sizes = getSizes()
        if(!this.orient){
            this.x = sizes.x
            this.y = sizes.y
        }
        else {
            this.x = sizes.y
            this.y = sizes.x
        }
    }
}