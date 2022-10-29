let list1 = document.querySelector("#list");
let cardForEtalon = document.querySelector("#imgKarta");
let listAndKard = document.querySelector("#listAndKard");
let imgInServer = document.querySelector(".imgInServer");
let realCount = document.querySelector("#realCount");
let countInFile = document.querySelector("#countInFile");
let allPaper = document.querySelector("#allPaper");
let prev = document.querySelector("#prev");
let next = document.querySelector("#next");
let pagenation = document.querySelector("#pagenation");

let cardSizeW = 86;
let cardSizeH = 54;

function renderListAndCard() {
    if(thisFile.x && thisFile.y){
        let x = thisFile.x;
        let y = thisFile.y;
        // if(thisFile.orient){
        //     list1.style.transform = "rotate(90deg)"
        // }
        // else {
        //     list1.style.transform = ""
        // }
        list1.style.transform = ""
        list1.style.opacity = "1"
        cardForEtalon.style.opacity = "1"
        prev.style.opacity = "1"
        next.style.opacity = "1"
        let etalon = 83;
        let coef = y/x
        let width = etalon/coef;
        let etalonForRender = 83

        // imgInServer.style.transform = ''
        containerForImgInServer.style.transform = ""

        let imgCoef = imgInServer.naturalHeight/imgInServer.naturalWidth
        imgInServer.style = ''

        if(imgCoef >= coef){
            let newCoef = 100 * coef / imgCoef
            imgInServer.style.width = newCoef+"%"
        }
        else {
            imgInServer.style.width = 100+"%"
        }

        let cardWidth = cardSizeW*100/x;
        console.log(cardWidth);

        if(coef < 1){
            // etalonForRender = etalon*coef
            // width = width*coef
            let newCoef = 100 * coef / imgCoef
            let coef1 = coef

            coef = x/y
            width = etalon/coef;
            list1.style.transform = "rotate(90deg)"
            containerForImgInServer.style.transform = "rotate(-90deg)"
            cardWidth = y/cardSizeW;

            imgInServer.style.width = newCoef*coef+"%"

            if(imgCoef >= coef1){
                imgInServer.style.width = newCoef*coef+"%"
            }
            else {
                imgInServer.style.width = 100/coef1+"%"
            }

        }

        list1.style.width = width+"vh"
        list1.style.minWidth = width+"vh"
        list1.style.height = etalonForRender+"vh"
        list1.style.minHeight = etalonForRender+"vh"

        if(coef <= 1){
            // etalon = etalon/coef
            // imgInServer.style = ''
            // imgInServer.style.width = 100+"%"
        }

        // cardForEtalon.style.width = etalon/cardWidth+"vh"
        // cardForEtalon.style.width = etalon/cardWidth+"vh"
        cardForEtalon.style.width = etalon/cardWidth+"vh"
    }
    else {
        list1.style.opacity = "0"
        cardForEtalon.style.opacity = "0"
        prev.style.opacity = "0"
        next.style.opacity = "0"
    }
}

prev.addEventListener("click", function () {
    if(thisFile.url.pag > 0){
        thisFile.url.pag--
        imgInServer.setAttribute("src", "/files/"+thisFile.url.url+thisFile.url.readdir[thisFile.url.pag])
    }
    pagenation.innerText = `${thisFile.url.pag+1}/${thisFile.url.count}`
})
next.addEventListener("click", function () {
    if(thisFile.url.pag < thisFile.url.count-1){
        thisFile.url.pag++
        imgInServer.setAttribute("src", "/files/"+thisFile.url.url+thisFile.url.readdir[thisFile.url.pag])
    }
    pagenation.innerText = `${thisFile.url.pag+1}/${thisFile.url.count}`
})

const listAndCardClass = new listAndCard()
listAndCardClass.queryListAndCard()