let main = document.querySelector("#main");
let files = document.querySelector("#files");
let users = document.querySelector("#users");
let prices = document.querySelector("#prices");
// let functions = document.querySelector("#functions");
let filesContainer = document.querySelector("#filesContainer");
let tbodyFileContainer = document.querySelector("#tbodyFileContainer");
// let path = document.querySelector("#path");
let goBackButton = document.querySelector("#goBackButton");
let goHomePathButton = document.querySelector("#goHomePathButton");
let pathContainer = document.querySelector("#pathContainer");
let errorAlert = document.querySelector("#errorAlert");
let dropdownMenu = document.querySelector("#dropdownMenu");
let iframe = document.querySelector("#iframe");
let headerMenuButtons = document.querySelector("#headerMenuButtons");
let pricesContainer = document.querySelector("#pricesContainer");
let pricesTableHeaderContainer = document.querySelector("#pricesTableHeaderContainer");

users.addEventListener('click', e => {
    filesContainer.classList.add("d-none")
})
prices.addEventListener('click', e => {
    filesContainer.classList.add("d-none")
    sendData("/getprices", "GET").then(e => {
        console.log(e);
        renderTable(e)
    })
})
// functions.addEventListener('click', function() {
//     filesContainer.classList.add("d-none")
// })

function renderTable(e) {
    pricesContainer.innerHTML = ""
    pricesTableHeaderContainer.innerHTML = ""
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


async function sendData(url, method, data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/octate-stream'
            // 'Content-Type': 'multipart/form-data'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
        body: data // body data type must match "Content-Type" header
    });
    let res = await response.json()
    return await res; // parses JSON response into native JavaScript objects
}