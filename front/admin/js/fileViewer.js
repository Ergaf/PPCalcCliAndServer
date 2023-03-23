document.querySelector("html").addEventListener("click", event => {
    dropdownMenu.classList.add("d-none")
})
// document.querySelector("html").addEventListener("contextmenu", event => {
//     event.preventDefault()
//     dropdownMenu.classList.remove("d-none")
//     dropdownMenu.style.top = `${event.clientY}px`
//     dropdownMenu.style.left = `${event.clientX}px`
// })
let pathString = ""
files.addEventListener('click', event => {
    dropdownMenu.classList.add("d-none")
    filesContainer.classList.remove("d-none")
    errorAlert.classList.add("d-none")
    tabl2.classList.add("d-none")
    tabl1.classList.add("d-none")
    statisticsContainer.classList.add("d-none")
    tbodySessions.classList.add("d-none")


    tbodyFileContainer.innerHTML = ""
    let data = {
        this: pathString,
        to: `/`
    }
    pathString = ""
    sendData("/adminfilesget", "POST", JSON.stringify(data)).then(e => {
            pathContainer.innerHTML = ""
            addPathUnit("./ files")
            pushFileUnit(e)
    })
})

goBackButton.addEventListener("click", function () {
    dropdownMenu.classList.add("d-none")
})

goHomePathButton.addEventListener("click", event => {
    dropdownMenu.classList.add("d-none")
    errorAlert.classList.add("d-none")
    let data = {
        this: pathString,
        to: `/`
    }
    pathString = ""
    sendData("/adminfilesget", "POST", JSON.stringify(data)).then(e => {
        pathContainer.innerHTML = ""
        addPathUnit("__dirname ./ files")
        tbodyFileContainer.innerHTML = ""
        pushFileUnit(e)
    })
})

function pickTrUnit(event, dataToServer) {
    dropdownMenu.classList.add("d-none")
    errorAlert.classList.add("d-none")
    let pathValue = pathString
    let data = {
        this: pathValue,
        to: `${pathValue}/${dataToServer}`
    }
    sendData("/adminfilesget", "POST", JSON.stringify(data)).then(e => {
        console.log(e);
        if(e.length > 0){
            if(e[0].isFileOpen){
                filesContainer.classList.add("d-none")
                iframe.classList.remove("d-none")
                iframe.setAttribute("src", e[0].url)
            }
            else if (e[0].error) {
                errorAlert.classList.remove("d-none")
                errorAlert.innerText = e[0].error.toString()
                tbodyFileContainer.innerHTML = ""
                addPathUnit(dataToServer)
            } else {
                tbodyFileContainer.innerHTML = ""
                addPathUnit(dataToServer)
                pathString = `${pathValue}/${dataToServer}`
                pushFileUnit(e)
            }
        }
        else {
            tbodyFileContainer.innerHTML = ""
            addPathUnit(dataToServer)
            pathString = `${pathValue}/${dataToServer}`
            let trContent = `
                        <th scope="row">1</th>
                        <td class="fileNameInFileView">Пустота..</td>
                        <td></td>
                        <td></td>`;
            let tr = document.createElement("tr");
            tr.innerHTML = trContent
            tbodyFileContainer.appendChild(tr)
        }
    })

    event.preventDefault();

    event = event || window.event;
    event.cancelBubble = true;

}

function addPathUnit(textToHtml) {
    let pathUnit = document.createElement("li")
    pathUnit.classList.add("breadcrumb-item")
    pathUnit.classList.add("pathUnit")
    pathUnit.innerText = `${textToHtml}`
    pathContainer.appendChild(pathUnit)
}

function pushFileUnit(e) {
    for (let i = 0; i < e.length; i++) {
        let trContent;
        if(e[i].isFile){
            trContent = `
                        <th scope="row">${i}</th>
                        <td class="fileNameInFileView">${e[i].name}</td>
                        <td>${e[i].size} кбит</td>
                        <td>${e[i].birthtime}</td>`;
        }
        else {
            trContent = `
                        <th scope="row">${i}</th>
                        <td class="fileNameInFileView"><img src="img/free-folder-icon-1484-thumb.png" class="mx-auto folderIcon" alt="..."> ${e[i].name}</td>
                        <td></td>
                        <td>${e[i].birthtime}</td>`;
        }
        let tr = document.createElement("tr");
        tr.classList.add("directoryUnit")
        tr.setAttribute("data", e[i].name)
        tr.innerHTML = trContent
        tr.addEventListener("click", event => {
            event.preventDefault();
            pickTrUnit(event, tr.getAttribute("data"));
            dropdownMenu.classList.add("d-none")
        })
        tbodyFileContainer.appendChild(tr)
    }
}