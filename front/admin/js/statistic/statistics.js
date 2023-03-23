let statisticsContainer = document.querySelector("#statisticsContainer");
let gr = document.querySelector("#gr");
let graphImage = document.querySelector("#graphImage");
statistics.addEventListener("click", function () {
    filesContainer.classList.add("d-none")
    tbodySessions.classList.add("d-none")
    tabl2.classList.add("d-none")
    tabl1.classList.add("d-none")
    statisticsContainer.classList.remove("d-none")
    sessionsContainer.classList.add("d-none")

    sendData("/getStatistics", "GET").then(e => {
        console.log(e);
    })
})