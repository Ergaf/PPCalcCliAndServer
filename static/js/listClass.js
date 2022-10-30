class listAndCard {
    item;
    constructor () {

    }
    queryListAndCard() {
        this.item = document.querySelector('#listAndCard');
        this.item.style.transform = "scale(1)"
        // this.item.onmousedown = this.dragAndDrop.bind( this);
        // this.item.onmousewheel = this.onWheel.bind( this);
    }

    dragAndDrop(e) {
        e.preventDefault()
        // let drag = e.target.closest('.listAndCard');
        // let drag = e.target.closest(this.item);

        let drag = this.item

        let coords = this.getCoords(drag);
        let shiftX = e.pageX - coords.left;
        let shiftY = e.pageY - coords.top;

        drag.style.position = 'absolute';
        moveAt(e);

        drag.style.zIndex = 2;

        function moveAt(e) {
            drag.style.left = e.pageX - shiftX + 'px';
            drag.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function(e) {
            moveAt(e);
        };

        drag.onmouseup = function() {
            document.onmousemove = null;
            drag.onmouseup = null;
        };
    }

    getCoords(elem) {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }
    onWheel(e) {
        e.preventDefault();
        let listInItem = Array.prototype.slice.call(this.item.children)[0];
        if(!listInItem.style.transform){
            listInItem.style.transform = "scale(1)"
        }
        // this.item.classList.add("invisible")
        // listInItem.classList.add("visible")
        let listW = this.getSizes(listInItem.style.transform)
        if(Math.sign(e.deltaY) === 1){
            listInItem.style.transform = `scale(${parseFloat(listW) - 0.05})`
        }
        if(Math.sign(e.deltaY) === -1){
            listInItem.style.transform = `scale(${parseFloat(listW) + 0.05})`
        }
    }

    resize(){

    }

    getSizes(listInItemSize){
        let float = ""
        for (let i = 0; i < listInItemSize.length; i++){
            if(
                listInItemSize[i] === "0" ||
                listInItemSize[i] === "1" ||
                listInItemSize[i] === "2" ||
                listInItemSize[i] === "3" ||
                listInItemSize[i] === "4" ||
                listInItemSize[i] === "5" ||
                listInItemSize[i] === "6" ||
                listInItemSize[i] === "7" ||
                listInItemSize[i] === "8" ||
                listInItemSize[i] === "9" ||
                listInItemSize[i] === "-" ||
                listInItemSize[i] === "."
            ) {
                float = float+listInItemSize[i]
            }
        }
        return float
    }
}

class navPanelCl {
    item;
    constructor () {

    }
    queryNavPanel() {
        this.item = document.querySelector('#navPanel');
        // this.item.style.transform = "scale(1)"
        this.item.onmousedown = this.dragAndDrop.bind( this);
        // this.item.onmousewheel = this.onWheel.bind( this);
    }

    dragAndDrop(e) {
        e.preventDefault()
        // let drag = e.target.closest('.listAndCard');
        // let drag = e.target.closest(this.item);

        let drag = this.item

        let coords = this.getCoords(drag);
        let shiftX = e.pageX - coords.left;
        let shiftY = e.pageY - coords.top;

        drag.style.position = 'absolute';
        moveAt(e);

        drag.style.zIndex = 2;

        function moveAt(e) {
            drag.style.left = e.pageX - shiftX + 'px';
            drag.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function(e) {
            moveAt(e);
        };

        drag.onmouseup = function() {
            document.onmousemove = null;
            drag.onmouseup = null;
        };
    }

    getCoords(elem) {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }
}