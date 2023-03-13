class fileInBasket {
    container;

    constructor (name, id) {
        this._name = name;
        this._id = id;
    }

    createFileInBasketContainer() {
        //create item and bind this object to this DOM element // query filesContainer
        let filesAllContainer = basketContainer
        let Item = document.createElement('div');
        this.container = Item;

        Item.classList.add('btn');
        Item.classList.add('btn-sm');
        Item.classList.add('slider-item');
        // Item.classList.add('btn-outline-dark');
        // Item.classList.add('align-items-center');
        Item.style.cssText = "display: flex; transition: 0.5s; white-space: nowrap"
        filesAllContainer.appendChild(Item);
        // Item.onmousedown = this.pick.bind( this);
        Item.innerText = this._name;

        let cancelButton = document.createElement('div');
        cancelButton.onmousedown = this.deleteThis.bind( this);
        cancelButton.classList.add('btn-close');
        Item.appendChild(cancelButton);
    }

    deleteThis() {
        sendData("/basket", "DELETE", JSON.stringify({id: this._id})).then((e, error) => {
            console.log(e);
            if(e.id.toString() === this._id.toString()){
                for (let i = 0; i < filesInBasket.length; i++){
                    if(filesInBasket[i]._id === this._id){
                        filesInBasket[i].container.remove()
                        filesInBasket.splice(i, 1)
                    }
                }
            }
        })
    }
}