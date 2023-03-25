const basketContainer = document.querySelector("#basketContainer");
const basketNotification = document.querySelector("#basketNotification");
const basketForRender = document.querySelector("#basketForRender");
let filesInBasket = [];
fetch('/getprices')
    .then(response => response.json())
    .then(json => {
        console.log(json)
        prices = json
        fetch("/orders")
            .then(response => response.json())
            .then(json => {
                console.log(json);
                if (json) {
                    if (json.length !== 0) {

                    }
                    json.forEach(o => {
                        let file1 = new file(o.name, o.id, o.count)
                        file1.url = o.url
                        file1.format = o.format
                        file1.calc = o.calc
                        file1.countInFile = o.countInFile
                        file1.sides = o.sides;
                        file1.color = o.color;
                        file1.cower = o.cower;
                        file1.paper = o.paper;
                        file1.destiny = o.destiny;
                        file1.destinyThis = o.destinyThis;
                        file1.binding = o.binding;
                        file1.bindingSelect = o.bindingSelect;
                        file1.lamination = o.lamination;
                        file1.roundCorner = o.roundCorner;
                        file1.frontLining = o.frontLining;
                        file1.backLining = o.backLining;
                        file1.big = o.big;
                        file1.holes = o.holes;
                        file1.countInFile = o.countInFile;
                        file1.allPaperCount = o.allPaperCount;
                        file1.orient = o.orient;
                        file1.stickerCutting = o.stickerCutting;
                        file1.stickerCuttingThis = o.stickerCuttingThis;
                        file1.x = o.x;
                        file1.y = o.y;
                        file1.url = o.url;
                        file1.list = o.list;
                        file1.calc = o.calc;
                        file1.touse = o.touse;
                        file1.luvers = o.luvers;
                        file1.bannerVarit = o.bannerVarit;
                        file1.floorLamination = o.floorLamination;
                        file1.widthLamination = o.widthLamination;
                        file1.price = o.price;
                        file1.canToOrder = o.canToOrder;
                        file1.inBasket = o.inBasket;

                        if(o.inBasket === false || o.inBasket === null || o.inBasket === 0){

                            // allFiles.push(file1)
                            // file1.createFileContainer()
                        } else {
                            filesInBasket.push(file1)
                            file1.createFileInBasketContainer()
                            basketNotification.innerHTML = parseInt(basketNotification.innerHTML)+1
                        }
                    })
                }
            })
    })