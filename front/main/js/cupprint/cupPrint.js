const cupPrint = document.querySelector("#cupPrint")
const afterPrint = document.querySelector("#afterPrint")

cupPrint.addEventListener("click", function (){
    activateModal()
    fileClassCalcToModal.innerHTML = "Друк на чашках"
    calcType = "cup"
    upload.classList.remove("d-none")
    fileLoadModalBody.classList.remove("d-none")
    $("#exampleModal").modal("show")

    // digitalPrintingContainer.classList.remove("d-none");
    // mainDisplay.classList.add("d-none");
    // toHomeButton.classList.remove("d-none");
})

afterPrint.addEventListener("click", function (){
    activateModal()
    fileClassCalcToModal.innerHTML = "Післядрукарська обробка"
    calcType = "afterPrint"
    upload.classList.add("d-none")
    fileLoadModalBody.classList.add("d-none")
    $("#exampleModal").modal("show")

    // digitalPrintingContainer.classList.remove("d-none");
    // mainDisplay.classList.add("d-none");
    // toHomeButton.classList.remove("d-none");
})