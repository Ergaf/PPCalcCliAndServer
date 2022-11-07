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
    axios.post("/orders")
        .then(e => {
            console.log(e);
            let file1 = new file(e.data.name, e.data.id)
            file1.format = e.data.format
            file1.countInFile = e.data.countInFile
            allFiles.push(file1)
            file1.createFileContainer()
            file1.pick({target: file1.container})
        })
})
upload.addEventListener("click", function () {
    uploadFile()
})

function uploadFile() {
    if(imgInp.files[0]){
        document.querySelector(".download").classList.remove("nonDisplay")
        let config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            response_type: "arraybuffer",
            // onUploadProgress(progressEvent) {
            //     const progress = progressEvent.loaded / progressEvent.total * 100
            //     progressbar.value = progress
            // }
        };
        let fd = new FormData();
        fd.append('file', imgInp.files[0], imgInp.files[0].name)
        axios.post("/upload", fd, config)
            .then(e => {
                let file1 = new file(e.data.name, e.data.id)
                file1.url = e.data.url
                file1.format = e.data.format
                file1.countInFile = e.data.countInFile
                allFiles.push(file1)
                file1.createFileContainer()
                file1.pick({target: file1.container})
                document.querySelector(".download").classList.add("nonDisplay")
            })
    }
}

let presetName = document.querySelector(".presetName")
let price = document.querySelector(".price")

const formatButtons = document.querySelector("#formatButtons");
Array.prototype.slice.call(formatButtons.children).forEach(e => {
    e.addEventListener("click", function () {
        thisFile.format = e.getAttribute("toFile")
        thisFile.renderSettings()
    })
})
let sidesButtons = document.querySelector("#sidesButtons")
Array.prototype.slice.call(sidesButtons.children).forEach(e => {
    e.addEventListener("click", function () {
        thisFile.sides = e.getAttribute("toFile")
        thisFile.renderSettings()
    })
})
let colorButtons = document.querySelector("#colorButtons")
Array.prototype.slice.call(colorButtons.children).forEach(e => {
    e.addEventListener("click", function () {
        thisFile.color = e.getAttribute("toFile")
        thisFile.renderSettings()
    })
})
let paperButtons = document.querySelector("#paperButtons")
Array.prototype.slice.call(paperButtons.children).forEach(e => {
    e.addEventListener("click", function () {
        thisFile.paper = e.getAttribute("toFile")
        thisFile.renderSettings()
    })
})
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


let countInt = document.querySelector("#countInt")
let sizeX = document.querySelector("#sizeX")
let sizeY = document.querySelector("#sizeY")
let prices;
fetch('https://script.googleusercontent.com/macros/echo?user_content_key=wLSQSatR6bZv9i8U5VtiOsa7GMSDGnnZijrnGFZE1_jwd1QJkdBz8Sl8ITa_TvVjVpf_ByOh6IcFuOZ7evsUSo_9NYtdFJYTm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDbwAl7CMxVAiYx-XcQGm2-pK98VFRlg2L1Bgi9-N5lGP8ipd0KGqDVV0UksueULwVpami56uyJ4IxkRYgJm5B_wls8-MAHEtdz9Jw9Md8uu&lib=MKqsPpMpIdvM_NE9JC918gzq7P1CHZY8E')
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
        document.querySelector(".mainContainer").classList.remove("nonDisplay")
        document.querySelector(".download").classList.add("nonDisplay")
    })

fetch("/orders")
    .then(response => response.json())
    .then(json => {
        console.log(json);
        json.orders.forEach(o => {
            let file1 = new file(o.name, o.id)
            file1.url = o.url
            file1.format = o.format
            file1.countInFile = o.countInFile
            allFiles.push(file1)
            file1.createFileContainer()
        })
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
    if(sizeX.value > 310){
        if(sizeY.value > 310){
            sizeY.value = 310
        }
        if(sizeX.value > 440){
            sizeX.value = 440
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
    if(sizeX.value > 310){
        if(sizeY.value > 310){
            sizeY.value = 310
        }
        if(sizeX.value > 440){
            sizeX.value = 440
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
    if(sizeY.value > 310){
        if(sizeX.value > 310){
            sizeX.value = 310
        }
        if(sizeY.value > 440){
            sizeY.value = 440
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
    if(sizeY.value > 310){
        if(sizeX.value > 310){
            sizeX.value = 310
        }
        if(sizeY.value > 440){
            sizeY.value = 440
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

let customButton = document.querySelector("#custom")
let presetsButton = document.querySelector("#presets")
let presetContainer = document.querySelector("#presetContainer")

customButton.addEventListener("click", function () {
    customButton.classList.add("btnm-act")
    presetsButton.classList.remove("btnm-act")
    presetContainer.classList.add("nonDisplay")
})
presetsButton.addEventListener("click", function () {
    presetsButton.classList.add("btnm-act")
    customButton.classList.remove("btnm-act")
    presetContainer.classList.remove("nonDisplay")
})

document.querySelector("#document").addEventListener("click", function () {
    thisFile.type = "ДОКУМЕНТ"
    thisFile.format = "A4"
    thisFile.sides = "one"
    thisFile.color = "bw"
    thisFile.destiny = "90 гр офісний"
    thisFile.renderSettings()

})
document.querySelector("#presentation").addEventListener("click", function () {
    thisFile.type = "ПРЕЗЕНТАЦІЯ"
    thisFile.format = "A4"
    thisFile.sides = "one"
    thisFile.color = "colors"
    thisFile.destiny = "160 гр DNS"
    thisFile.renderSettings()
})
document.querySelector("#poster").addEventListener("click", function () {
    thisFile.type = "Постер"
    thisFile.format = "A3"
    thisFile.sides = "one"
    thisFile.color = "colors"
    thisFile.destiny = "160 гр DNS"
    thisFile.renderSettings()
})
document.querySelector("#card").addEventListener("click", function () {
    thisFile.type = "card"
    thisFile.format = "A6"
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.destiny = undefined
    thisFile.renderSettings()
})
document.querySelector("#visitCard").addEventListener("click", function () {
    thisFile.type = "visitCard"
    thisFile.format = "A5"
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.destiny = undefined
    thisFile.renderSettings()
})
document.querySelector("#sticker").addEventListener("click", function () {
    thisFile.type = "sticker"
    thisFile.format = ""
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.destiny = undefined
    thisFile.renderSettings()
})
document.querySelector("#tags").addEventListener("click", function () {
    thisFile.type = "tags"
    thisFile.format = ""
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.destiny = undefined
    thisFile.renderSettings()
})
document.querySelector("#brochure").addEventListener("click", function () {
    thisFile.type = "brochure"
    thisFile.format = ""
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.destiny = undefined
    thisFile.renderSettings()
})
document.querySelector("#note").addEventListener("click", function () {
    thisFile.type = "note"
    thisFile.format = ""
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.destiny = undefined
    thisFile.renderSettings()
})
document.querySelector("#calendar").addEventListener("click", function () {
    thisFile.type = "calendar"
    thisFile.format = ""
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.destiny = undefined
    thisFile.renderSettings()
})
