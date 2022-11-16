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
    calc;
    touse;
    luvers;
    bannerVarit;
    floorLamination;
    matteLamination;
    glossLamination;
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
        Item.classList.add('btn-sm');
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
            // document.querySelector(".settingsContainer").style.display = "flex"
            document.querySelector(".settingsContainer").classList.remove("d-none")
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
                    // document.querySelector(".settingsContainer").style.display = "none"
                    document.querySelector(".settingsContainer").classList.add("d-none")
                    digitalPrintingContainer.classList.add("d-none")
                    mainDisplay.classList.remove("d-none")
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
        Array.prototype.slice.call(selectButtonCalc.children).forEach(e => {
            if(e.getAttribute("toFile") === this.calc){
                e.classList.add("btnm-act")
            }
            else {
                e.classList.remove("btnm-act")
            }
        })
        if(thisFile.calc === "digital"){
            let formats = `
                    <div class="btn" toFile="A7">A7</div>
                    <div class="btn" toFile="A6">A6</div>
                    <div class="btn" toFile="A5">A5</div>
                    <div class="btn" toFile="A4">А4</div>
                    <div class="btn" toFile="A3">А3</div>
                    <div class="btn" toFile="custom">Свій розмір</div>
                        `;
            formatButtons.innerHTML = formats;
            colorButtons.classList.remove("d-none")
            sidesButtons.classList.remove("d-none")
            paperButtons.classList.remove("d-none")
            destinyThisButtons.classList.add("d-none")
            toUseButtons.classList.add("d-none");
            this.renderDigitalCalc(priceCalc)
        }
        else if(thisFile.calc === "wide"){
            let formats = `
                    <div class="btn" toFile="A2">А2</div>
                    <div class="btn" toFile="A1">А1</div>
                    <div class="btn" toFile="A0">А0</div>
                    <div class="btn" toFile="custom">Свій розмір</div>
                        `;
            formatButtons.innerHTML = formats;

            colorButtons.classList.add("d-none")
            sidesButtons.classList.add("d-none")
            paperButtons.classList.add("d-none")

            destinyButtons.innerHTML = ""
            roundCornerButtons.classList.add("d-none")
            holesButtons.classList.add("d-none")
            bigButtons.classList.add("d-none")
            laminationButtons.classList.add("d-none")
            bindingSelectButtons.classList.add("d-none")
            bindingButtons.classList.add("d-none")
            cowerButtons.classList.add("d-none")
            frontLiningButtons.classList.add("d-none")
            backLiningButtons.classList.add("d-none")
            stickerCutting.classList.add("d-none")
            stickerCuttingThis.classList.add("d-none")
            backLiningText.classList.add("d-none")

            toUseButtons.classList.remove("d-none");
            accordionOptions.classList.remove("d-none");
            this.renderWideCalc(priceCalc)
        }
        Array.prototype.slice.call(formatButtons.children).forEach(e => {
            e.addEventListener("click", function () {
                thisFile.format = e.getAttribute("toFile")
                thisFile.renderSettings()
            })
        });


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

        if(thisFile.url){
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
                if(!this.url2.pdf || lastFileId !== thisFile._id){
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
            if(!this.url2.pdf || lastFileId !== thisFile._id){
                pdfjsLib.getDocument("/files/totest/file1.pdf").then((pdf) => {
                    this.url2.pdf = pdf
                    render();
                })
            }
        }
        renderListAndCard()
        if(thisFile.url2.pdf){
            document.querySelector("#page_count").innerText = thisFile.url2.pdf.numPages
            this.countInFile = thisFile.url2.pdf.numPages
        }
        if(thisFile){
            lastFileId = thisFile._id
        }
        realCount.value = this.realCount
        countInt.value = this._count
        countInFile.value = this.countInFile
        allPaper.value = this.allPaperCount
        if(this.realCount < 2){
            arkushi.innerText = "аркуш"
        }
        if(this.realCount > 1 && this._count < 5){
            arkushi.innerText = "аркуша"
        }
        if(this.realCount > 4){
            arkushi.innerText = "аркушів"
        }
        if(this._count < 2){
            primirnyk.innerText = "примірник"
        }
        if(this._count > 1 && this._count < 5){
            primirnyk.innerText = "примірника"
        }
        if(this._count > 4){
            primirnyk.innerText = "примірників"
        }

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

    renderDigitalCalc(priceCalc){
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
    }

    renderWideCalc(priceCalc){
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
        matteLamination.innerHTML = ""
        glossLamination.innerHTML = ""
        if(getVariantsFromNameInData(`Доп ${thisFile.destiny}`) !== undefined){
            luvers.classList.remove("d-none")
            bannerVarit.classList.remove("d-none")
            floorLamination.classList.remove("d-none")
            matteLamination.classList.remove("d-none")
            glossLamination.classList.remove("d-none")
            getVariantsFromNameInData(`Доп ${thisFile.destiny}`).forEach(e => {
                if(e[0] === "Встановлення люверсов"){
                    let elem = document.createElement("div")
                    elem.innerText = e[0]
                    elem.classList.add("btn")
                    elem.addEventListener("click", function () {
                        thisFile.luvers = elem.innerText
                        thisFile.renderSettings()
                    })
                    if(e[0] === thisFile.luvers){
                        elem.classList.add("btnm-act")
                    }
                    luvers.appendChild(elem)
                }
                if(e[0] === "Проварювання банера"){
                    let elem = document.createElement("div")
                    elem.innerText = e[0]
                    elem.classList.add("btn")
                    elem.addEventListener("click", function () {
                        thisFile.bannerVarit = elem.innerText
                        thisFile.renderSettings()
                    })
                    if(e[0] === thisFile.bannerVarit){
                        elem.classList.add("btnm-act")
                    }
                    bannerVarit.appendChild(elem)
                }
                if(e[0] === "Напольне ламінування"){
                    let elem = document.createElement("div")
                    elem.innerText = e[0]
                    elem.classList.add("btn")
                    elem.addEventListener("click", function () {
                        thisFile.floorLamination = elem.innerText
                        thisFile.renderSettings()
                    })
                    if(e[0] === thisFile.floorLamination){
                        elem.classList.add("btnm-act")
                    }
                    floorLamination.appendChild(elem)
                }
                if(e[0] === "Ламінування матове"){
                    let elem = document.createElement("div")
                    elem.innerText = e[0]
                    elem.classList.add("btn")
                    elem.addEventListener("click", function () {
                        thisFile.matteLamination = elem.innerText
                        thisFile.renderSettings()
                    })
                    if(e[0] === thisFile.matteLamination){
                        elem.classList.add("btnm-act")
                    }
                    matteLamination.appendChild(elem)
                }
                if(e[0] === "Ламінування глянцеве"){
                    let elem = document.createElement("div")
                    elem.innerText = e[0]
                    elem.classList.add("btn")
                    elem.addEventListener("click", function () {
                        thisFile.glossLamination = elem.innerText
                        thisFile.renderSettings()
                    })
                    if(e[0] === thisFile.glossLamination){
                        elem.classList.add("btnm-act")
                    }
                    glossLamination.appendChild(elem)
                }
            })
        }
    }
}