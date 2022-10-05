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
    x;
    y;
    constructor (name) {
        this._name = name;
        this._id = new Date();
        this._count = 1
    }
    createFileContainer() {
        //create item and bind this object to this DOM element // query filesContainer
        let filesAllContainer = document.querySelector('.FilesContainer');
        let Item = document.createElement('div');
        this.container = Item;

        Item.classList.add('btn');
        Item.classList.add('btn-outline-dark');
        Item.classList.add('align-items-center');
        // Item.classList.add('bg-light');
        Item.style.cssText = "display: flex; padding: 1vmin; transition: 0.5s;"
        filesAllContainer.appendChild(Item);
        Item.onmousedown = this.pick.bind( this);

        let nameContainer = document.createElement('div');
        nameContainer.innerHTML = this._name;
        this.nameContainer = nameContainer;
        Item.appendChild(nameContainer);

        let cancelButton = document.createElement('div');
        cancelButton.onmousedown = this.deleteThis.bind( this);
        cancelButton.classList.add('btn');
        cancelButton.classList.add('btn-outline-danger');
        cancelButton.classList.add('btn-sm');
        cancelButton.innerText = " X"
        Item.appendChild(cancelButton);
    }

    pick(e){
        if(e.target === this.container || e.target === this.nameContainer){
            allFiles.forEach(e => {
                if(e._id !== this._id){
                    e.removePick()
                }
            })

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

    renderSettings() {
        let priceCalc = 0;
        destinySelect.innerHTML = ""
        if(getDestinyInData() !== undefined){
            this.destinyAppend()
            priceCalc = getDestinyPrice(this._count)*this._count;
            if(this.format === "Свій розмір"){
                let sss = Math.ceil(this._count / getHowInASheet())
                priceCalc = getDestinyPrice(sss)*sss;
            }
        }
        bindingSelect.innerHTML = ""
        if(getBindingInData() !== []){
            this.bindingAppend()
        }
        price.innerText = priceCalc
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
        countInt.value = this._count
        if(this.format !== "Свій розмір"){
            this.getSize()
        }
        sizeX.value = this.x
        sizeY.value = this.y
        renderListAndCard()
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