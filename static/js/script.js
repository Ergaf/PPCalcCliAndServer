const upload = document.querySelector("#upload")
const nonUpload = document.querySelector("#nonUpload")
const addFileButton = document.querySelector("#addFileButton");
const list = document.querySelector(".list");
const orient = document.querySelector("#orient");
const stickerCutting = document.querySelector("#stickerCutting");
const stickerCuttingThis = document.querySelector("#stickerCuttingThis");
const arkushi = document.querySelector("#arkushi");
const primirnyk = document.querySelector("#primirnyk");
const containerForImgInServer = document.querySelector("#containerForImgInServer");
const containerForPdfInServer = document.querySelector("#containerForPdfInServer");
const mainDisplay = document.querySelector("#mainDisplay");
const digitalPrintingContainer = document.querySelector("#digitalPrintingContainer");
const selectButtonCalc = document.querySelector("#selectButtonCalc");
const digitalPrint = document.querySelector("#digitalPrint");
const widescreenPrint = document.querySelector("#widescreenPrint");
const fileClassCalcToModal = document.querySelector("#fileClassCalcToModal");
const toUseButtons = document.querySelector("#toUseButtons");
const destinyThisButtons = document.querySelector("#destinyThisButtons");
const toHomeButton = document.querySelector("#toHomeButton");

const luvers = document.querySelector("#luvers");
const bannerVarit = document.querySelector("#bannerVarit");
const floorLamination = document.querySelector("#floorLamination");
const widthLamination = document.querySelector("#widthLamination");




toHomeButton.addEventListener("click", function () {
    digitalPrintingContainer.classList.add("d-none")
    mainDisplay.classList.remove("d-none")
})
toHomeButton.addEventListener("click", function () {
    digitalPrintingContainer.classList.add("d-none")
    mainDisplay.classList.remove("d-none")
})

digitalPrint.addEventListener("click", event => {
    fileClassCalcToModal.innerHTML = "digital"
})
widescreenPrint.addEventListener("click", event => {
    fileClassCalcToModal.innerHTML = "wide"
})
// const digitalCalcButton = document.querySelector("#digitalCalcButton");
// const digitalCalcButtonNotFile = document.querySelector("#digitalCalcButtonNotFile");
// const widescreenCalcButton = document.querySelector("#widescreenCalcButton");
// const widescreenCalcButtonNotFile = document.querySelector("#widescreenCalcButtonNotFile");
// const photoCalcButton = document.querySelector("#photoCalcButton");
// const photoCalcButtonNotFile = document.querySelector("#photoCalcButtonNotFile");
// digitalCalcButton.addEventListener("click", function () {
    // mainDisplay.classList.add("d-none")
    // digitalPrintingContainer.classList.remove("d-none")
// })
// digitalCalcButtonNotFile.addEventListener("click", function () {
//     axios.post("/orders")
//         .then(e => {
//             let file1 = new file(e.data.name, e.data.id)
//             file1.format = e.data.format
//             file1.countInFile = e.data.countInFile
//             allFiles.push(file1)
//             file1.createFileContainer()
//             file1.pick({target: file1.container})
//             mainDisplay.classList.add("d-none")
//             digitalPrintingContainer.classList.remove("d-none")
//         })
// })
// widescreenCalcButton.addEventListener("click", function () {
//     // mainDisplay.classList.add("d-none")
//     // digitalPrintingContainer.classList.remove("d-none")
// })
// widescreenCalcButtonNotFile.addEventListener("click", function () {
//     // mainDisplay.classList.add("d-none")
//     // digitalPrintingContainer.classList.remove("d-none")
// })

const digitalCalcSelect = document.querySelector("#digitalCalcSelect");
const widelCalcSelect = document.querySelector("#widelCalcSelect");
digitalCalcSelect.addEventListener("click", event => {
    widelCalcSelect.classList.remove("btnm-act")
    digitalCalcSelect.classList.add("btnm-act")
    thisFile.calc = digitalCalcSelect.getAttribute("toFile")
    thisFile.renderSettings()
})
widelCalcSelect.addEventListener("click", event => {
    widelCalcSelect.classList.add("btnm-act")
    digitalCalcSelect.classList.remove("btnm-act")
    thisFile.calc = widelCalcSelect.getAttribute("toFile")
    thisFile.renderSettings()
})

const allFiles = []
let thisFile;
let lastFileId;

orient.addEventListener("click", function () {
    if(thisFile.format === "custom"){
        let iks = thisFile.x
        let igrik = thisFile.y
        thisFile.x = igrik
        thisFile.y = iks
    }
    thisFile.orient = !thisFile.orient
    thisFile.renderSettings()
})

addFileButton.addEventListener("click", function () {
    // let data = {
    //     do: "createNew"
    // }
    // sendData("/orders", "POST", JSON.stringify(data))
    //     .then(e => {
    //         console.log(e);
    //         let file1 = new file(e.name)
    //         file1._id = e.id
    //         allFiles.push(file1)
    //         file1.createFileContainer()
    //     })
})
nonUpload.addEventListener("click", function () {
    let config = {
        data: {
            calc: fileClassCalcToModal.innerHTML
        },
    };
    axios.post("/orders", config)
        .then(e => {
            console.log(e);
            let file1 = new file(e.data.name, e.data.id)
            file1.format = e.data.format
            file1.countInFile = e.data.countInFile
            file1.calc = fileClassCalcToModal.innerHTML
            allFiles.push(file1)
            file1.createFileContainer()
            file1.pick({target: file1.container})
            document.querySelector(".settingsContainer").classList.remove("d-none")
            digitalPrintingContainer.classList.remove("d-none")
            mainDisplay.classList.add("d-none")
        })
})
upload.addEventListener("click", function () {
    uploadFile(imgInp)
})

// document.querySelector("#digitalCalcButton").addEventListener("click", e => {
//     uploadFile(document.querySelector("#digitalCalcInput"))
// })

function uploadFile(fileInput) {
    if(fileInput.files[0]){
        // document.querySelector("#download").classList.remove("d-none")
        let config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            response_type: "arraybuffer",
            onUploadProgress(progressEvent) {
                const progress = progressEvent.loaded / progressEvent.total * 100
                progressbar.value = progress
            },
            data: {
                calc: fileClassCalcToModal.innerHTML
            },
        };
        let fd = new FormData();
        fd.append('file', fileInput.files[0], fileInput.files[0].name)
        axios.post("/upload", fd, config)
            .then(e => {
                mainDisplay.classList.add("d-none")
                digitalPrintingContainer.classList.remove("d-none")
                let file1 = new file(e.data.name, e.data.id)
                file1.url = e.data.url
                file1.format = e.data.format
                file1.countInFile = e.data.countInFile
                allFiles.push(file1)
                file1.createFileContainer()
                file1.pick({target: file1.container})
                // document.querySelector("#download").classList.add("d-none")
            })
    }
}

let presetName = document.querySelector(".presetName")
let price = document.querySelector(".price")

const formatButtons = document.querySelector("#formatButtons");
let sidesButtons = document.querySelector("#sidesButtons");
let colorButtons = document.querySelector("#colorButtons");
let paperButtons = document.querySelector("#paperButtons");
let destinyButtons = document.querySelector("#destinyButtons")
let laminationButtons = document.querySelector("#laminationButtons")
let cowerButtons = document.querySelector("#cowerButtons")
let frontLiningButtons = document.querySelector("#frontLiningButtons")
let backLiningButtons = document.querySelector("#backLiningButtons")
let backLiningText = document.querySelector("#backLiningText")
let bindingButtons = document.querySelector("#bindingButtons")
let bindingSelectButtons = document.querySelector("#bindingSelectButtons")
let bigButtons = document.querySelector("#bigButtons")
let holesButtons = document.querySelector("#holesButtons")
let roundCornerButtons = document.querySelector("#roundCornerButtons")
let text = document.querySelector("#text")
let accordionOptions = document.querySelector("#accordionOptions")
Array.prototype.slice.call(sidesButtons.children).forEach(e => {
    e.addEventListener("click", function () {
        thisFile.sides = e.getAttribute("toFile")
        thisFile.renderSettings()
    })
});
Array.prototype.slice.call(colorButtons.children).forEach(e => {
    e.addEventListener("click", function () {
        thisFile.color = e.getAttribute("toFile")
        thisFile.renderSettings()
    })
})
Array.prototype.slice.call(paperButtons.children).forEach(e => {
    e.addEventListener("click", function () {
        thisFile.paper = e.getAttribute("toFile")
        thisFile.renderSettings()
    })
})

let countInt = document.querySelector("#countInt")
let sizeX = document.querySelector("#sizeX")
let sizeY = document.querySelector("#sizeY")
let prices;
fetch('https://script.googleusercontent.com/macros/echo?user_content_key=wLSQSatR6bZv9i8U5VtiOsa7GMSDGnnZijrnGFZE1_jwd1QJkdBz8Sl8ITa_TvVjVpf_ByOh6IcFuOZ7evsUSo_9NYtdFJYTm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDbwAl7CMxVAiYx-XcQGm2-pK98VFRlg2L1Bgi9-N5lGP8ipd0KGqDVV0UksueULwVpami56uyJ4IxkRYgJm5B_wls8-MAHEtdz9Jw9Md8uu&lib=MKqsPpMpIdvM_NE9JC918gzq7P1CHZY8E')
// fetch('/getprices')
    .then(response => response.json())
    .then(json => {
        let x = 1
        let data = [];
        json.forEach(e => {
            if(e[0] === ''){
                x=1
            }
            else {
                if(x === 1){
                    data.push({
                        name: e[0],
                        variants: []
                    })
                    x = 0
                }
                else {
                    data[data.length-1].variants.push(e)
                }
            }
        })
        console.log(data)
        prices = data

        if(allFiles.length > 0){
            mainDisplay.classList.add("d-none")
            digitalPrintingContainer.classList.remove("d-none")
            document.querySelector("#download").classList.add("d-none")
        }
        else {
            digitalPrintingContainer.classList.add("d-none")
            document.querySelector("#download").classList.add("d-none")
            mainDisplay.classList.remove("d-none")
        }
    })

fetch("/orders")
    .then(response => response.json())
    .then(json => {
        console.log(json);
        if(json.orders){
            if(json.orders.length !== 0){
                // mainDisplay.classList.add("d-none")
                // digitalPrintingContainer.classList.remove("d-none")
            }
            json.orders.forEach(o => {
                let file1 = new file(o.name, o.id)
                file1.url = o.url
                file1.format = o.format
                file1.calc = o.calc
                file1.countInFile = o.countInFile
                allFiles.push(file1)
                file1.createFileContainer()
            })
        }
    })

let optContainer = document.querySelector(".optionsContainer")

countInt.addEventListener("change", function () {
    if(countInt.value < 1){
        countInt.value = 1
    }
    thisFile._count = countInt.value
    thisFile.renderSettings()
})
countInt.addEventListener("wheel", function () {
    event.preventDefault();
    if(Math.sign(event.deltaY) === 1){
        countInt.value = parseInt(countInt.value)-1
    }
    if(Math.sign(event.deltaY) === -1){
        countInt.value = parseInt(countInt.value)+1
    }
    if(countInt.value < 1){
        countInt.value = 1
    }
    thisFile._count = countInt.value
    thisFile.renderSettings()
})

sizeX.addEventListener("change", function () {
    if(sizeX.value < 45){
        sizeX.value = 45
    }
    if(thisFile.calc === "digital"){
        if(sizeX.value > 310){
            if(sizeY.value > 310){
                sizeY.value = 310
            }
            if(sizeX.value > 440){
                sizeX.value = 440
            }
        }
    }
    thisFile.x = sizeX.value
    thisFile.y = sizeY.value
    thisFile.format = "custom"
    thisFile.renderSettings()
})
sizeX.addEventListener("wheel", function () {
    event.preventDefault();
    if(Math.sign(event.deltaY) === 1){
        sizeX.value = parseInt(sizeX.value)-1
    }
    if(Math.sign(event.deltaY) === -1){
        sizeX.value = parseInt(sizeX.value)+1
    }
    if(sizeX.value < 45){
        sizeX.value = 45
    }
    if(thisFile.calc === "digital"){
        if(sizeX.value > 310){
            if(sizeY.value > 310){
                sizeY.value = 310
            }
            if(sizeX.value > 440){
                sizeX.value = 440
            }
        }
    }
    thisFile.x = sizeX.value
    thisFile.y = sizeY.value
    thisFile.format = "custom"
    thisFile.renderSettings()
})
sizeY.addEventListener("change", function () {
    if(sizeY.value < 45){
        sizeY.value = 45
    }
    if(thisFile.calc === "digital"){
        if(sizeY.value > 310){
            if(sizeX.value > 310){
                sizeX.value = 310
            }
            if(sizeY.value > 440){
                sizeY.value = 440
            }
        }
    }
    thisFile.y = sizeY.value
    thisFile.x = sizeX.value
    thisFile.format = "custom"
    thisFile.renderSettings()
})
sizeY.addEventListener("wheel", function () {
    event.preventDefault();
    if(Math.sign(event.deltaY) === 1){
        sizeY.value = parseInt(sizeY.value)-1
    }
    if(Math.sign(event.deltaY) === -1){
        sizeY.value = parseInt(sizeY.value)+1
    }
    if(sizeY.value < 45){
        sizeY.value = 45
    }
    if(thisFile.calc === "digital"){
        if(sizeY.value > 310){
            if(sizeX.value > 310){
                sizeX.value = 310
            }
            if(sizeY.value > 440){
                sizeY.value = 440
            }
        }
    }
    thisFile.y = sizeY.value
    thisFile.x = sizeX.value
    thisFile.format = "custom"
    thisFile.renderSettings()
})

let imgInp = document.querySelector("#imgInp")
let iframe = document.querySelector("#iframe")
let form = document.querySelector("#formmm")
let progressbar = document.querySelector("#progressbar")

function renderr(uri){
    let list = document.querySelector(".list")
    let imgG = document.createElement("img")
    imgG.classList.add("lol")
    imgG.setAttribute("src", uri)
    list.appendChild(imgG)
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
    return await response.json(); // parses JSON response into native JavaScript objects
}
