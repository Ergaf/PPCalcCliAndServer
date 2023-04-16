promoAccept = document.querySelector("#promoAccept")
acceptedValid = document.querySelector("#acceptedValid")

promoAccept.addEventListener("click", function () {
    console.log(acceptedValid);
    if(document.querySelector("#promo").value === "SKRYPIN"){
        thisFile.promo = {
            status: "accepted",
            type: "percent",
            percent: 15
        }
        acceptedValid.innerText = "accepted!"
        acceptedValid.style.color = "green"
        thisFile.renderSettings()
    }
    else {
        acceptedValid.innerText = "denied!"
        acceptedValid.style.color = "red"
    }
})