prices.addEventListener('click', e => {
    filesContainer.classList.add("d-none")
    tbodySessions.classList.add("d-none")
    tabl2.classList.remove("d-none")
    tabl1.classList.remove("d-none")
    statisticsContainer.classList.remove("d-none")
    sendData("/getprices", "GET").then(e => {
        console.log(e);
        renderTable(e)
        let dataRework1 = dataRework(e)
        console.log(dataRework1);
    })
})

function renderTable(e) {
    pricesContainer.innerHTML = ""
    pricesContainer.classList.remove("d-none")
    pricesTableHeaderContainer.innerHTML = ""
    pricesTableHeaderContainer.classList.remove("d-none")
    let th1 = document.createElement("th")
    th1.innerText = "#"
    th1.classList.add("headerTableUnit")
    pricesTableHeaderContainer.appendChild(th1)
    for (let i = 0; i < e[0].length; i++){
        let th1 = document.createElement("th")
        th1.innerText = i.toString()
        th1.classList.add("headerTableUnit")
        pricesTableHeaderContainer.appendChild(th1)
    }
    for (let i = 0; i < e.length; i++){
        let tr = document.createElement("tr")
        let th = document.createElement("th")
        th.innerText = i.toString()
        th.classList.add("headerTableUnit")
        tr.appendChild(th)
        for (let o = 0; o < e[i].length; o++){
            let th = document.createElement("th")
            th.classList.add("tableUnit")
            th.innerText = e[i][o]
            tr.appendChild(th)
            th.addEventListener("click", target => {

            })
        }
        pricesContainer.appendChild(tr)
    }
}

function dataRework(json) {
    let x = 1
    let data = [];
    json.forEach(e => {
        if(e[0] === null){
            x=1
        }
        else {
            if(x === 1){
                data.push({
                    name: e[0],
                    children: []
                })
                x = 0
            }
            else {
                data[data.length-1].children.push(e)
            }
        }
    })
    return data
}