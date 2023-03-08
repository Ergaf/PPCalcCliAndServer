class file {
    container;
    nameContainer;
    format;
    sides;
    color;
    cower;
    paper;
    destiny;
    destinyThis;
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
    widthLamination;
    price;

    rotateImgFromNav;
    constructor (name, id, count) {
        this.rotateImgFromNav = 0;
        this._name = name;
        this._id = id;
        this._count = count
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
        Item.classList.add('slider-item');
        // Item.classList.add('btn-outline-dark');
        // Item.classList.add('align-items-center');
        Item.style.cssText = "display: flex; transition: 0.5s; white-space: nowrap"
        filesAllContainer.appendChild(Item);
        Item.onmousedown = this.pick.bind( this);
        Item.innerText = this._name;

        let cancelButton = document.createElement('div');
        cancelButton.onmousedown = this.deleteThis.bind( this);
        cancelButton.classList.add('btn-close');
        Item.appendChild(cancelButton);
    }

    pick(e){
        // console.log(e.target);
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
        sendData("/orders", "DELETE", JSON.stringify({id: this._id})).then((e, error) => {
            // console.log(error);
            // console.log(e);
            if(e.toString() === this._id.toString()){
                if(thisFile === this){
                    // document.querySelector(".settingsContainer").style.display = "none"
                    document.querySelector(".settingsContainer").classList.add("d-none")
                    if(allFiles.length < 2){
                        digitalPrintingContainer.classList.add("d-none");
                        mainDisplay.classList.remove("d-none");
                        toFilesButton.classList.add("d-none");
                        toHomeButton.classList.add("d-none");
                    }
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
            renderDigitalCalc(priceCalc)
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
            renderWideCalc(priceCalc)
        } else if(thisFile.calc === "photo"){
            let formats = `
                    <div class="btn" toFile="10х15">10х15</div>
                    <div class="btn" toFile="15х21">15х21</div>
                    <div class="btn" toFile="13х18">13х18</div>
                    <div class="btn" toFile="A4">А4</div>
                    <div class="btn" toFile="custom">Свій розмір</div>
                        `;
            formatButtons.innerHTML = formats;


            toUseButtons.classList.add("d-none");
            accordionOptions.classList.add("d-none");

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
        }
        Array.prototype.slice.call(formatButtons.children).forEach(e => {
            if(e.getAttribute("toFile") !== "custom"){
                e.addEventListener("click", function () {
                    let data = {
                        id: thisFile._id,
                        parameter: "format",
                        value: e.getAttribute("toFile")
                    }
                    sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
                        if(o.status === "ok"){
                            thisFile.format = e.getAttribute("toFile")
                            thisFile.renderSettings()
                        } else {
                            showError(o)
                        }
                    })
                })
            }
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
            // imgInServer.setAttribute("src", "")
            containerForImgInServer.classList.remove("d-none")
            containerForPdfInServer.classList.add("d-none")

            let image = new Image();
            image.onload = function(){
                imgInServer.setAttribute("src", image.src)
                renderListAndCard()
            }
            // image.src = "/files/totest/file-1.png";
            image.src = thisFile.url.url;
            document.querySelector("#page_count").innerText = 1

            // if(!this.url2.pdf || lastFileId !== thisFile._id){
            //     pdfjsLib.getDocument("/files/totest/file-1.png").then((pdf) => {
            //         this.url2.pdf = pdf
            //         render();
            //     })
            // }
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

        if(thisFile.url.red === true){
            btnCrop.removeClass('d-none')
        } else {
            btnCrop.addClass('d-none')
        }
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