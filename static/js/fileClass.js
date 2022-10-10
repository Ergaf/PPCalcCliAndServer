class file {
    container;
    nameContainer;
    type;
    format;
    sides;
    color;
    cower;
    destiny;
    binding;
    lamination;
    roundCorner;
    cutting;
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

        Item.classList.add('btn');
        Item.classList.add('btn-outline-dark');
        Item.classList.add('align-items-center');
        Item.style.cssText = "display: flex; padding: 1vmin; transition: 0.5s;"
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

            this.container.classList.remove("btn-outline-dark")
            this.container.classList.add("btn-dark")

            let presetName = document.querySelector(".presetName")
            presetName.innerText = this.type

            thisFile = this
            this.renderSettings()
            document.querySelector(".settingsContainer").style.display = "flex"
        }
    }
    removePick() {
        this.container.classList.remove("btn-dark")
        this.container.classList.add("btn-outline-dark")
    }
    deleteThis() {
        // if(thisFile === this){
        //     document.querySelector(".settingsContainer").style.display = "none"
        // }
        // for (let i = 0; i < allFiles.length; i++){
        //     if(allFiles[i]._id === this._id){
        //         allFiles[i].container.remove()
        //         allFiles.splice(i, 1)
        //     }
        // }
        // if(allFiles.length < 1){
        //     document.querySelector(".settingsContainer").style.display = "none"
        // }

        sendData("/orders", "DELETE", JSON.stringify({id: this._id})).then(e => {
            console.log(e);
            console.log(this._id);
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
                if(allFiles.length < 1){
                    document.querySelector(".settingsContainer").style.display = "none"
                }
            }
        })
    }

    renderSettings() {
        let priceCalc = 0;
        this.realCount = this._count
        destinySelect.innerHTML = ""
        if(getDestinyInData() !== undefined){
            this.destinyAppend()
            priceCalc = getDestinyPrice(this._count)*this._count;
            if(this.format === "Свій розмір"){
                let sss = Math.ceil(this._count / getHowInASheet())
                this.realCount = sss
                priceCalc = getDestinyPrice(sss)*sss;
            }
        }
        bindingSelect.innerHTML = ""
        if(getBindingInData() !== []){
            this.bindingAppend()
        }
        price.value = priceCalc
        formatSelect.value = this.format
        sidesSelect.value = this.sides
        colorSelect.value = this.color
        destinySelect.value = this.destiny
        cowerSelect.value = this.cower
        bindingSelect.value = this.binding
        laminationSelect.value = this.lamination
        roundCornerSelect.value = this.roundCorner
        cuttingSelect.value = this.cutting
        presetName.innerText = this.type
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
    }

    destinyAppend() {
        getDestinyInData().forEach(e => {
            let opt = document.createElement("option")
            opt.innerText = e[0]
            opt.value = e[0]
            destinySelect.appendChild(opt)
        })
    }

    bindingAppend() {
        getBindingInData().forEach(e => {
            let opt = document.createElement("option")
            opt.innerText = e[0]
            opt.value = e[0]
            bindingSelect.appendChild(opt)
        })
    }

    getSize() {
        let sizes = getSizes()
        this.x = sizes.x
        this.y = sizes.y
    }
}