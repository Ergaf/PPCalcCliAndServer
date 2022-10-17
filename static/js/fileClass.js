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
    orient;
    x;
    y;
    url;
    constructor (name, id) {
        this._name = name;
        this._id = id;
        this._count = 1
        this.orient = false
    }
    createFileContainer() {
        //create item and bind this object to this DOM element // query filesContainer
        let filesAllContainer = document.querySelector('.FilesContainer');
        let Item = document.createElement('div');
        this.container = Item;

        Item.classList.add('btnm');
        // Item.classList.add('btn-outline-dark');
        // Item.classList.add('align-items-center');
        Item.style.cssText = "display: flex; transition: 0.5s;"
        filesAllContainer.appendChild(Item);
        Item.onmousedown = this.pick.bind( this);

        let nameContainer = document.createElement('div');
        nameContainer.innerHTML = this._name;
        this.nameContainer = nameContainer;
        Item.appendChild(nameContainer);

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
            // console.log(this);
            // this.container.classList.remove("btn-outline-dark")
            this.container.classList.add("btnm-act")
            thisFile = this
            this.renderSettings()
            document.querySelector(".settingsContainer").style.display = "flex"
        }
    }
    removePick() {
        this.container.classList.remove("btnm-act")
        // this.container.classList.add("btn-outline-dark")
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
                // if(allFiles.length < 1){
                //     document.querySelector(".settingsContainer").style.display = "none"
                // }
            }
        })
    }

    renderSettings() {
        let priceCalc = 0;
        this.realCount = this._count
        // if(getDestinyInData() !== undefined){
        //     this.destinyAppend()
        //     priceCalc = getDestinyPrice(this._count)*this._count;
        //     if(this.format === "Свій розмір"){
        //         let sss = Math.ceil(this._count / getHowInASheet())
        //         this.realCount = sss
        //         priceCalc = getDestinyPrice(sss)*sss;
        //     }
        // }
        destinyButtons.innerHTML = ""
        roundCornerButtons.innerHTML = ""
        holesButtons.innerHTML = ""
        bigButtons.innerHTML = ""
        if(getVariantsFromNameInData(thisFile.paper) !== undefined){
            getVariantsFromNameInData(thisFile.paper).forEach(e => {
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btnm")
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
        if(getVariantsFromNameInData("згиби") !== undefined){
            if(this.big === undefined){
                this.big = "без згинання"
            }
            getVariantsFromNameInData("згиби").forEach(e => {
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btnm")
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
                elem.classList.add("btnm")
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
                elem.classList.add("btnm")
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
        laminationButtons.innerHTML = ""
        bindingSelectButtons.innerHTML = ""
        bindingButtons.innerHTML = ""
        cowerButtons.innerHTML = ""
        frontLiningButtons.innerHTML = ""
        backLiningButtons.innerHTML = ""
        backLiningText.innerText = ""
        // if(getBindingInData() !== []){
        //     this.bindingAppend()
        // }
        if(this.paper === "" || this.paper === undefined){
            thisFile.bindingSelect = undefined
            thisFile.lamination = undefined
            thisFile.binding = undefined
            thisFile.cower = undefined
            thisFile.frontLining = undefined
            thisFile.backLining = undefined
        }
        if(this.paper === "на папері"){
            if(getVariantsFromNameInData("ламінування") !== undefined){
                if(this.lamination === undefined){
                    this.lamination = "без ламінації"
                }
                getVariantsFromNameInData("ламінування").forEach(e => {
                    let elem = document.createElement("div")
                    elem.innerText = e[0]
                    elem.classList.add("btnm")
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
            if(getVariantsFromNameInData("прошивка") !== undefined){
                if(this.binding === undefined){
                    this.binding = "без прошивки"
                }
                getVariantsFromNameInData("прошивка").forEach(e => {
                    let elem = document.createElement("div")
                    elem.innerText = e[0]
                    elem.classList.add("btnm")
                    if(e[0] === "на пластикову" || e[0] === "на металеву"){
                        elem.addEventListener("click", function () {
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
                    elem.classList.add("btnm")
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
                        getVariantsFromNameInData("обкладинка").forEach(e => {
                            let elem = document.createElement("div")
                            elem.innerText = e[0]
                            elem.classList.add("btnm")
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
                    if(this.cower !== "без обкладинки"){
                        backLiningText.innerText = "з задньою подкладкою"
                        if(this.frontLining === undefined){
                            this.frontLining = "з прозорою лицьовою підкладкою"
                        }
                        if(getVariantsFromNameInData("лицьова підкладка") !== undefined){
                            getVariantsFromNameInData("лицьова підкладка").forEach(e => {
                                let elem = document.createElement("div")
                                elem.innerText = e[0]
                                elem.classList.add("btnm")
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
                                elem.classList.add("btnm")
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
        }
        if(this.paper === "на самоклейці"){
            thisFile.bindingSelect = undefined
            thisFile.lamination = undefined
            thisFile.binding = undefined
            thisFile.cower = undefined
            thisFile.frontLining = undefined
            thisFile.backLining = undefined
        }
        if(this.paper === "на xerox transparencies"){
            thisFile.bindingSelect = undefined
            thisFile.lamination = undefined
            thisFile.binding = undefined
            thisFile.cower = undefined
            thisFile.frontLining = undefined
            thisFile.backLining = undefined
        }
        price.value = priceCalc
        Array.prototype.slice.call(formatButtons.children).forEach(e => {
            if(e.innerText === this.format){
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

        realCount.value = this.realCount
        countInt.value = this._count
        if(this.format !== "Свій розмір"){
            this.getSize()
        }
        sizeX.value = this.x
        sizeY.value = this.y
        renderListAndCard()
        this.nameContainer.innerText = this._name
        if(thisFile.url){
            if(thisFile.url.ext === 1){
                imgInServer.setAttribute("src", "/files/"+thisFile.url.url);
            }
            else {
                imgInServer.setAttribute("src", "/files/"+thisFile.url.url+thisFile.url.readdir[thisFile.url.pag])
            }
            pagenation.innerText = `${thisFile.url.pag+1}/${thisFile.url.count}`
        }
        else {
            imgInServer.setAttribute("src", "")
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
            +" "
            +this.bindingSelect
    }

    // destinyAppend() {
    //     getDestinyInData().forEach(e => {
    //         let opt = document.createElement("option")
    //         opt.innerText = e[0]
    //         opt.value = e[0]
    //         destinySelect.appendChild(opt)
    //     })
    // }

    bindingAppend() {
        getBindingInData().forEach(e => {
            let opt = document.createElement("option")
            opt.innerText = e[0]
            opt.value = e[0]
            // bindingSelect.appendChild(opt)
        })
    }

    getSize() {
        let sizes = getSizes()
        this.x = sizes.x
        this.y = sizes.y
    }
}