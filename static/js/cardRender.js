let list1 = document.querySelector(".list");
let cardForEtalon = document.querySelector(".imgKarta");

let cardSizeW = 86;
let cardSizeH = 54;

function renderListAndCard() {
    if(thisFile.x && thisFile.y){
        list1.style.display = "inline-block"
        cardForEtalon.style.display = "inline-block"
        let etalon = 83;
        let x = thisFile.x;
        let y = thisFile.y;
        let coef = y/x
        let width = 80/coef;
        let etalonForRender = 83

        if(coef < 1){
            etalonForRender = etalon*coef
            width = width*coef
        }

        console.log(coef);

        list1.style.width = width+"vh"
        list1.style.height = etalonForRender+"vh"

        let cardWidth = x/cardSizeW;

        if(coef > 1){
            etalon = etalon/coef
        }

        cardForEtalon.style.width = etalon/cardWidth+"vh"
    }
    else {
        list1.style.display = "none"
        cardForEtalon.style.display = "none"
    }
}