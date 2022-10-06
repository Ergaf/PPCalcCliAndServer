let list1 = document.querySelector(".list");
let cardForEtalon = document.querySelector(".imgKarta");
let imgInServer = document.querySelector(".imgInServer");
let realCount = document.querySelector("#realCount");
let prev = document.querySelector("#prev");
let next = document.querySelector("#next");
let pagenation = document.querySelector("#pagenation");

let cardSizeW = 86;
let cardSizeH = 54;

function renderListAndCard() {
    if(thisFile.x && thisFile.y){
        list1.style.opacity = "1"
        cardForEtalon.style.opacity = "1"
        prev.style.opacity = "1"
        next.style.opacity = "1"
        let etalon = 83;
        let x = thisFile.x;
        let y = thisFile.y;
        let coef = y/x
        let width = etalon/coef;
        let etalonForRender = 83

        if(coef < 1){
            etalonForRender = etalon*coef
            width = width*coef
        }

        list1.style.width = width+"vh"
        list1.style.height = etalonForRender+"vh"
        imgInServer.style.width = width+"vh"

            let cardWidth = x/cardSizeW;

        if(coef > 1){
            etalon = etalon/coef
        }

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
        imgInServer.setAttribute("src", "/getImg/"+thisFile.url.url+thisFile.url.pag+thisFile.url.ext)
    }
    pagenation.innerText = `${thisFile.url.pag+1}/${thisFile.url.count}`
})
next.addEventListener("click", function () {
    if(thisFile.url.pag < thisFile.url.count-1){
        thisFile.url.pag++
        imgInServer.setAttribute("src", "/getImg/"+thisFile.url.url+thisFile.url.pag+thisFile.url.ext)
    }
    pagenation.innerText = `${thisFile.url.pag+1}/${thisFile.url.count}`
})