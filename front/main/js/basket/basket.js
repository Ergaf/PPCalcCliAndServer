const basketShow = document.querySelector("#basketShow")
const basketContainer = document.querySelector("#basketContainer")
const basketNotification = document.querySelector("#basketNotification")
const toBasket = document.querySelector("#toBasket")
let filesInBasket = [];

basketShow.addEventListener("click", function (){

})

toBasket.addEventListener("click", function (){
    sendData("/basket", "POST", JSON.stringify({id: thisFile._id})).then((e, error) => {
        console.log(e);
        if(e.status === "ok" && e.id === thisFile._id){
            thisFile.moveToBasket()
        } else {
            toastBody.innerText = e.error
            toastHeader.innerText = e.status
            toast.show()
        }
    })
})

let basketForRender = `
<div>
    <div></div>
    <div></div>
    <div></div>
</div>
`