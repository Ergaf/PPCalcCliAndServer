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

    constructor(name, id, count) {
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
        let filesAllContainer = document.querySelector('.FilesContainer');
        let Item = document.createElement('div');
        this.container = Item;

        Item.classList.add('btn');
        Item.classList.add('btn-sm');
        Item.classList.add('slider-item');
        Item.style.cssText = "display: flex; transition: 0.5s; white-space: nowrap"
        filesAllContainer.appendChild(Item);
        Item.onmousedown = this.pick.bind(this);
        Item.innerText = this._name;

        let cancelButton = document.createElement('div');
        cancelButton.onmousedown = this.deleteThis.bind(this);
        cancelButton.classList.add('btn-close');
        Item.appendChild(cancelButton);
    }

    createFileInBasketContainer() {
        let filesAllContainer = basketContainer
        let Item = document.createElement('div');
        this.container = Item;

        Item.classList.add('card');
        Item.classList.add('d-flex');
        Item.classList.add('flex-row');
        // Item.classList.add('btn-sm');
        // Item.classList.add('slider-item');
        // Item.style.cssText = "display: flex; transition: 0.5s; white-space: nowrap"
        filesAllContainer.appendChild(Item);
        // Item.onmousedown = this.pick.bind( this);
        // Item.innerText = this._name;

        let iconContainer = document.createElement('div');
        iconContainer.classList.add("inBasketIconContainer");
        iconContainer.classList.add("d-flex");
        iconContainer.classList.add("justify-content-center");
        iconContainer.classList.add("align-items-center");
        Item.appendChild(iconContainer);

        //create list
        let list = document.createElement('div');
        this.list = list;
        list.classList.add("list");
        // list.classList.add("justify-content-center");
        // list.classList.add("align-items-center");
        iconContainer.appendChild(list);

        if (this.format !== "custom") {
            this.getSize()
        }
        if (this.url) {
            if (this.url.img) {
                let containerForImg = document.createElement('div');
                list.appendChild(containerForImg);

                let img = document.createElement('img');
                img.setAttribute("draggable", "false")
                img.setAttribute("alt", "img")
                img.classList.add('iconInBasket');
                containerForImg.appendChild(img);

                let image = new Image();
                let x = this.x;
                let y = this.y;
                image.onload = function () {
                    img.setAttribute("src", image.src)
                    renderListIfImg(x, y, list, containerForImg, img)
                }
                image.src = this.url.url;

            } else {
                let containerForPdf = document.createElement('div');
                list.appendChild(containerForPdf);

                let pdff = document.createElement('div');
                // pdf.setAttribute("draggable", "false")
                pdff.classList.add('iconInBasket');
                containerForPdf.appendChild(pdff);

                let myPdf = document.createElement('div');
                // myPdf.classList.add('myPdfViewer');
                pdff.appendChild(myPdf);

                let theCanvas = document.createElement('div');
                // theCanvas.classList.add('theCanvas');
                myPdf.appendChild(theCanvas);

                let PdfRenderer = document.createElement('canvas');
                // PdfRenderer.classList.add('pdfRenderer');
                theCanvas.appendChild(PdfRenderer);

                let x = this.x;
                let y = this.y;
                pdfjsLib.getDocument(this.url.url).then((pdf) => {
                    this.url2.pdf = pdf

                    if (this.url2.pdf) {
                        // document.querySelector("#page_count").innerText = thisFile.url2.pdf.numPages
                        this.countInFile = this.url2.pdf.numPages
                    }

                    renderListIfPdf(x, y, list, containerForPdf, pdff, myPdf, PdfRenderer, this)
                    renderPdfInBasket(this, PdfRenderer, list, containerForPdf, pdff, myPdf);
                })

            }
        }
        //list completed

        let infoContainer = document.createElement('div');
        Item.appendChild(infoContainer);

        let controlButtonsContainer = document.createElement('div');
        // controlButtonsContainer.classList.add('card-header');
        controlButtonsContainer.classList.add('d-flex');
        controlButtonsContainer.classList.add('justify-content-between');
        controlButtonsContainer.style.cssText = "padding-left: 7px; padding-right: 7px; padding-top: 5px; padding-bottom: 5px;"
        infoContainer.appendChild(controlButtonsContainer);

        let nameContainer = document.createElement('div');
        nameContainer.innerText = this._name
        nameContainer.classList.add('inBasketNameContainer');
        controlButtonsContainer.appendChild(nameContainer);

        let removeInBasketButton = document.createElement('div');
        removeInBasketButton.onmousedown = this.reMoveInBasket.bind(this);
        removeInBasketButton.innerText = `<`
        removeInBasketButton.style.cssText = "padding-left: 5px; padding-right: 7px;"
        removeInBasketButton.classList.add('mousePointer');
        removeInBasketButton.classList.add('toBlackIfHover');
        removeInBasketButton.classList.add('invisible');
        controlButtonsContainer.appendChild(removeInBasketButton);

        let cancelButton = document.createElement('div');
        cancelButton.onmousedown = this.deleteThis.bind(this);
        cancelButton.classList.add('btn-close');
        cancelButton.classList.add('mousePointer');
        cancelButton.classList.add('invisible');
        controlButtonsContainer.appendChild(cancelButton);
        let basketForRender = ""
        if(this.calc === "digital" || this.calc === "wide"|| this.calc === "photo"){
            basketForRender = `<div style="padding-left: 10px; padding-bottom: 5px;">
                <div class="inBasketValue"><span class="text-secondary lFont">Тип друку: </span>${getUkrType(this.calc)} ${getUkrType(this.sides)} ${getUkrType(this.color)}</div>
                <div class="inBasketValue"><span class="text-secondary lFont">Тип матеріалу: </span>${this.paper}</div>
                <div class="inBasketValueWrap"><span class="text-secondary lFont">Матеріал: </span>${this.destiny}</div>
                <div class="inBasketValue"><span class="text-secondary lFont">Формат: </span>${this.format}: ${this.x} x ${this.y}</div>
                <div class="inBasketValue"><span class="text-secondary lFont">Кількість: </span>${this._count}</div>
                <div class="inBasketValue"><span class="text-secondary lFont">Ціна: </span>${this.price} грн.</div>
            </div>`
        } else if (this.calc === "cup"){
            basketForRender = `<div style="padding-left: 10px; padding-bottom: 5px;">
                <div class="inBasketValue"><span class="text-secondary lFont">Тип друку: </span>${getUkrType(this.calc)} ${getUkrType(this.sides)} ${getUkrType(this.color)}</div>
                <div class="inBasketValueWrap"><span class="text-secondary lFont">Чашка: </span>${this.destiny}</div>
                <div class="inBasketValue"><span class="text-secondary lFont">Кількість: </span>${this._count}</div>
                <div class="inBasketValue"><span class="text-secondary lFont">Ціна: </span>${this.price} грн.</div>
            </div>`
        }
        let body = document.createElement('div');
        body.innerHTML = basketForRender;
        infoContainer.appendChild(body);
    }

    moveToBasket() {
        for (let i = 0; i < allFiles.length; i++) {
            if (allFiles[i]._id === this._id) {
                allFiles[i].container.remove()
                this.inBasket = true;
                filesInBasket.push(this)
                this.createFileInBasketContainer()
                basketNotification.innerHTML = parseInt(basketNotification.innerHTML) + 1
                settingsContainer.classList.add("d-none")
                allFiles.splice(i, 1)
                if (allFiles.length === 0) {
                    digitalPrintingContainer.classList.add("d-none");
                    mainDisplay.classList.remove("d-none");
                    toFilesButton.classList.add("d-none");
                    toHomeButton.classList.add("d-none");
                }
            }
        }
    }

    reMoveInBasket() {
        sendData("/basket", "DELETE", JSON.stringify({id: this._id})).then((e, error) => {
            console.log(e);
            if (e.id.toString() === this._id.toString()) {
                for (let i = 0; i < filesInBasket.length; i++) {
                    if (filesInBasket[i]._id === this._id) {
                        filesInBasket[i].container.remove()
                        allFiles.push(this)
                        this.createFileContainer()
                        this.inBasket = false;
                        filesInBasket.splice(i, 1)
                        basketNotification.innerHTML = parseInt(basketNotification.innerHTML) - 1
                        this.pick({target: this.container})
                        digitalPrintingContainer.classList.remove("d-none");
                        mainDisplay.classList.add("d-none");
                        toHomeButton.classList.remove("d-none");
                    }
                }
            } else {
                toastBody.innerText = e.error
                toastHeader.innerText = e.status
                toast.show()
            }
        })
    }

    pick(e) {
        if (e.target === this.container || e.target === this.nameContainer) {
            allFiles.forEach(e => {
                if (e._id !== this._id) {
                    e.removePick()
                }
            })
            this.container.classList.add("btnm-act")
            thisFile = this
            this.renderSettings()
            // document.querySelector(".settingsContainer").style.display = "flex"
            settingsContainer.classList.remove("d-none")
        }
    }

    removePick() {
        this.container.classList.remove("btnm-act")
    }

    deleteThis() {
        sendData("/orders", "DELETE", JSON.stringify({id: this._id})).then((e, error) => {
            // console.log(error);
            console.log(e);
            console.log(this.inBasket);
            if (e.status === "ok" && e.id.toString() === this._id.toString()) {
                if (thisFile === this) {
                    // document.querySelector(".settingsContainer").style.display = "none"
                    document.querySelector(".settingsContainer").classList.add("d-none")
                    if (allFiles.length < 2) {
                        digitalPrintingContainer.classList.add("d-none");
                        mainDisplay.classList.remove("d-none");
                        toFilesButton.classList.add("d-none");
                        toHomeButton.classList.add("d-none");
                    }
                }
                if(this.inBasket === true || this.inBasket === 1){
                    for (let i = 0; i < filesInBasket.length; i++) {
                        if (filesInBasket[i]._id === this._id) {
                            this.container.remove()
                            filesInBasket.splice(i, 1)
                            basketNotification.innerHTML = parseInt(basketNotification.innerHTML) - 1
                        }
                    }
                } else {
                    for (let i = 0; i < allFiles.length; i++) {
                        if (allFiles[i]._id === this._id) {
                            allFiles[i].container.remove()
                            allFiles.splice(i, 1)
                        }
                    }
                }
            } else {
                toastBody.innerText = e.error
                toastHeader.innerText = e.status
                toast.show()
            }
        })
    }

    renderSettings() {
        // console.log(thisFile);
        this.allPaperCount = this.countInFile * thisFile._count
        if (this.format !== "custom") {
            this.getSize()
        } else {
            thisFile.orient = false
        }
        sizeX.value = this.x
        sizeY.value = this.y

        let priceCalc = 0;
        Array.prototype.slice.call(selectButtonCalc.children).forEach(e => {
            if (e.getAttribute("toFile") === this.calc) {
                e.classList.add("btnm-act")
            } else {
                e.classList.remove("btnm-act")
            }
        })
        price.value = thisFile.price
        if (thisFile.calc === "digital") {
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
            formatInputs.classList.remove("d-none");
            fileViewContainer.classList.remove("d-none");
            ifPrintCountLists.classList.remove("d-none");
            countInFile.innerText = this.countInFile
            renderDigitalCalc(priceCalc)
            renderListAndCard()
        } else if (thisFile.calc === "wide") {
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
            formatInputs.classList.remove("d-none");

            toUseButtons.classList.remove("d-none");
            accordionOptions.classList.remove("d-none");
            fileViewContainer.classList.remove("d-none");
            ifPrintCountLists.classList.remove("d-none");
            countInFile.innerText = this.countInFile
            renderWideCalc(priceCalc)
            renderListAndCard()
        } else if (thisFile.calc === "photo") {
            let formats = `
                    <div class="btn" toFile="10х15">10х15</div>
                    <div class="btn" toFile="15х21">15х21</div>
                    <div class="btn" toFile="13х18">13х18</div>
                    <div class="btn" toFile="A4">А4</div>
                    <div class="btn" toFile="A3">А3</div>
                    <div class="btn" toFile="custom">Свій розмір</div>
                        `;
            formatButtons.innerHTML = formats;
            // formatButtons.innerHTML = "";


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
            formatInputs.classList.remove("d-none");
            fileViewContainer.classList.remove("d-none");
            ifPrintCountLists.classList.add("d-none");
            // renderOptions("ФОТО ДРУК", "format", formatButtons)
            thisFile.realCount = thisFile._count
            // let cupPrice = getPriceFromCount(thisFile.format, "ФОТО ДРУК")
            // console.log(cupPrice);
            // thisFile.price = cupPrice*thisFile._count
            price.value = thisFile.price
            renderListAndCard()
        }
        else if (thisFile.calc === "cup"){
            toUseButtons.classList.add("d-none");
            colorButtons.classList.add("d-none")
            sidesButtons.classList.add("d-none")
            accordionOptions.classList.add("d-none");
            formatInputs.classList.add("d-none");
            paperButtons.classList.add("d-none");
            fileViewContainer.classList.add("d-none");
            ifPrintCountLists.classList.add("d-none");
            destinyButtons.innerHTML = ""
            formatButtons.innerHTML = "";
            renderOptions("чашки", "destiny", destinyButtons)
            thisFile.realCount = thisFile._count
            // let cupPrice = getPriceFromCount(thisFile.destiny, "чашки")
            // thisFile.price = cupPrice*thisFile._count
            price.value = thisFile.price
            // thisFile.renderSettings()
        }
        else if (thisFile.calc === "afterPrint"){
            toUseButtons.classList.add("d-none");
            colorButtons.classList.add("d-none")
            sidesButtons.classList.add("d-none")
            accordionOptions.classList.add("d-none");
            formatInputs.classList.add("d-none");
            paperButtons.classList.add("d-none");
            fileViewContainer.classList.add("d-none");
            ifPrintCountLists.classList.add("d-none");
            destinyButtons.innerHTML = ""
            formatButtons.innerHTML = "";
            renderOptions("Післядрукарська обробка", "destiny", destinyButtons)
            thisFile.realCount = thisFile._count
            // let cupPrice = getPriceFromCount(thisFile.destiny, "Післядрукарська обробка")
            // thisFile.price = cupPrice*thisFile._count
            price.value = thisFile.price
        }
        Array.prototype.slice.call(formatButtons.children).forEach(e => {
            if (e.getAttribute("toFile") !== "custom") {
                e.addEventListener("click", function () {
                    let data = {
                        id: thisFile._id,
                        parameter: "format",
                        value: e.getAttribute("toFile")
                    }
                    sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
                        if (o.status === "ok") {
                            thisFile.format = e.getAttribute("toFile")
                            thisFile.price = o.price
                            thisFile.renderSettings()
                        } else {
                            showError(o)
                        }
                    })
                })
            }
        });
        Array.prototype.slice.call(formatButtons.children).forEach(e => {
            if (e.getAttribute("toFile") === this.format) {
                e.classList.add("btnm-act")
            } else {
                e.classList.remove("btnm-act")
            }
        })
        Array.prototype.slice.call(sidesButtons.children).forEach(e => {
            if (e.getAttribute("toFile") === this.sides) {
                e.classList.add("btnm-act")
            } else {
                e.classList.remove("btnm-act")
            }
        })
        Array.prototype.slice.call(colorButtons.children).forEach(e => {
            if (e.getAttribute("toFile") === this.color) {
                e.classList.add("btnm-act")
            } else {
                e.classList.remove("btnm-act")
            }
        })
        Array.prototype.slice.call(paperButtons.children).forEach(e => {
            if (e.getAttribute("toFile") === this.paper) {
                e.classList.add("btnm-act")
            } else {
                e.classList.remove("btnm-act")
            }
        })
        if (thisFile.url) {
            if (thisFile.url.img) {
                let image = new Image();
                image.onload = function () {
                    imgInServer.setAttribute("src", image.src)
                    renderListAndCard()
                }
                image.src = thisFile.url.url;

                containerForImgInServer.classList.remove("d-none")
                containerForPdfInServer.classList.add("d-none")
                // imgInServer.setAttribute("src", image.src)
                document.querySelector("#page_count").innerText = 1
            } else {
                imgInServer.setAttribute("src", "")
                containerForImgInServer.classList.add("d-none")
                containerForPdfInServer.classList.remove("d-none")
                if (!this.url2.pdf || lastFileId !== thisFile._id) {
                    pdfjsLib.getDocument(thisFile.url.url).then((pdf) => {
                        this.url2.pdf = pdf
                        render();
                    })
                }
            }
        } else {
            containerForImgInServer.classList.remove("d-none")
            containerForPdfInServer.classList.add("d-none")

            let image = new Image();
            image.onload = function () {
                imgInServer.setAttribute("src", image.src)
            }
            image.src = thisFile.url.url;
            document.querySelector("#page_count").innerText = 1
        }
        // renderListAndCard()
        if (thisFile.url2.pdf) {
            document.querySelector("#page_count").innerText = thisFile.url2.pdf.numPages
            this.countInFile = thisFile.url2.pdf.numPages
        }
        if (thisFile) {
            lastFileId = thisFile._id
        }
        realCount.value = this.realCount
        countInt.value = this._count
        countInFile.value = this.countInFile
        allPaper.value = this.allPaperCount
        if(thisFile.calc === "cup"){
            if (this._count < 2) {
                primirnyk.innerText = "чашка"
            }
            if (this._count > 1 && this._count < 5) {
                primirnyk.innerText = "чашки"
            }
            if (this._count > 4) {
                primirnyk.innerText = "чашек"
            }
            allCountElement.classList.add("d-none")
        } else if(thisFile.calc === "afterPrint"){
            if (this._count < 2) {
                primirnyk.innerText = "штука"
            }
            if (this._count > 1 && this._count < 5) {
                primirnyk.innerText = "штуки"
            }
            if (this._count > 4) {
                primirnyk.innerText = "штук"
            }
            allCountElement.classList.add("d-none")
        } else {
            if (this.realCount < 2) {
                arkushi.innerText = "аркуш"
            }
            if (this.realCount > 1 && this._count < 5) {
                arkushi.innerText = "аркуша"
            }
            if (this.realCount > 4) {
                arkushi.innerText = "аркушів"
            }
            if (this._count < 2) {
                primirnyk.innerText = "примірник"
            }
            if (this._count > 1 && this._count < 5) {
                primirnyk.innerText = "примірника"
            }
            if (this._count > 4) {
                primirnyk.innerText = "примірників"
            }

            if (this.countInFile < 2) {
                storinki.innerText = "сторінка"
            }
            if (this.countInFile > 1 && this._count < 5) {
                storinki.innerText = "сторінки"
            }
            if (this.countInFile > 4) {
                storinki.innerText = "сторінок"
            }

            allCountElement.classList.remove("d-none")
        }

        text.innerText = this.format
            + ", "
            + this.color
            + " color, "
            + this.sides
            + " sides, "
            + this.paper
            + " "
            + this.destiny
            + ", "
            + this.lamination
            + ", "
            + this.binding
            + ", "
            + this.bindingSelect
            + ", "
            + this.cower
            + ", "
            + this.frontLining
            + ", "
            + ", "
            + ", "
            + this.backLining
            + ", "
            + this.frontLining
            + ", "
            + this.big
            + ", "
            + this.holes
            + ", "
            + this.roundCorner

        if (thisFile.url.red === true) {
            btnCrop.removeClass('d-none')
        } else {
            btnCrop.addClass('d-none')
        }
    }

    getSize() {
        let sizes = getSizes(this)
        if (!this.orient) {
            this.x = sizes.x
            this.y = sizes.y
        } else {
            this.x = sizes.y
            this.y = sizes.x
        }
    }
}