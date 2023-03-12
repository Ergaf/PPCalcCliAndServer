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
            if(thisFile._id === e.id){
                // document.querySelector(".settingsContainer").style.display = "none"
                document.querySelector(".settingsContainer").classList.add("d-none")
                if(allFiles.length < 2){
                    digitalPrintingContainer.classList.add("d-none");
                    mainDisplay.classList.remove("d-none");
                    toFilesButton.classList.add("d-none");
                    toHomeButton.classList.add("d-none");
                }
            }
            for (let i = 0; i < allFiles.length; i++){
                if(allFiles[i]._id === e.id){
                    allFiles[i].container.remove()
                    allFiles.splice(i, 1)
                }
            }
            basketNotification.innerHTML = parseInt(basketNotification.innerHTML)+1
        } else {
            toastBody.innerText = "Без файлу неможна додати до кошику та зробити замовлення."
            toastHeader.innerText = "Error"
            toast.show()
        }
    })
})