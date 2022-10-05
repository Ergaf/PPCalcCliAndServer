
const allFiles = []
let thisFile;

const addFileButton = document.querySelector("#addFileButton");
addFileButton.addEventListener("click", function () {
    let file1 = new file("Замовлення")
    allFiles.push(file1)
    file1.createFileContainer()
})

let presetName = document.querySelector(".presetName")
let price = document.querySelector(".price")

let formatSelect = document.querySelector("#formatSelect")
let sidesSelect = document.querySelector("#sidesSelect")
let colorSelect = document.querySelector("#colorSelect")
let destinySelect = document.querySelector("#destinySelect")
let cowerSelect = document.querySelector("#cowerSelect")
let bindingSelect = document.querySelector("#bindingSelect")
let laminationSelect = document.querySelector("#laminationSelect")
let roundCornerSelect = document.querySelector("#roundCornerSelect")
let cuttingSelect = document.querySelector("#cuttingSelect")
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

let optContainer = document.querySelector(".optionsContainer")
document.querySelector("#document").addEventListener("click", function () {
    thisFile.type = "Документ"
    thisFile.format = "A4"
    thisFile.sides = "Односторонній"
    thisFile.color = "Чорно-білий"
    thisFile.destiny = "90 гр"
    thisFile.renderSettings()

})
document.querySelector("#presentation").addEventListener("click", function () {
    thisFile.type = "Презентація"
    thisFile.format = "A4"
    thisFile.sides = "Односторонній"
    thisFile.color = "Кольоровий"
    thisFile.destiny = "160 гр DNS"
    thisFile.renderSettings()
})
document.querySelector("#poster").addEventListener("click", function () {
    thisFile.type = "Постер"
    thisFile.format = "A3"
    thisFile.sides = "Односторонній"
    thisFile.color = "Кольоровий"
    thisFile.destiny = "160 гр DNS"
    thisFile.renderSettings()
})
document.querySelector("#card").addEventListener("click", function () {
    thisFile.type = "card"
    thisFile.format = "A6"
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.renderSettings()
})
document.querySelector("#visitCard").addEventListener("click", function () {
    thisFile.type = "visitCard"
    thisFile.format = "A5"
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.renderSettings()
})
document.querySelector("#sticker").addEventListener("click", function () {
    thisFile.type = "sticker"
    thisFile.format = ""
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.renderSettings()
})
document.querySelector("#tags").addEventListener("click", function () {
    thisFile.type = "tags"
    thisFile.format = ""
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.renderSettings()
})
document.querySelector("#brochure").addEventListener("click", function () {
    thisFile.type = "brochure"
    thisFile.format = ""
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.renderSettings()
})
document.querySelector("#note").addEventListener("click", function () {
    thisFile.type = "note"
    thisFile.format = ""
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.renderSettings()
})
document.querySelector("#calendar").addEventListener("click", function () {
    thisFile.type = "calendar"
    thisFile.format = ""
    thisFile.sides = ""
    thisFile.color = ""
    thisFile.renderSettings()
})

formatSelect.addEventListener("change", function () {
    thisFile.type = "Змінено користувачем"
    thisFile.format = formatSelect.value
    thisFile.renderSettings()
})
sidesSelect.addEventListener("change", function () {
    thisFile.type = "Змінено користувачем"
    thisFile.sides = sidesSelect.value
    thisFile.renderSettings()
})
colorSelect.addEventListener("change", function () {
    thisFile.type = "Змінено користувачем"
    thisFile.color = colorSelect.value
    thisFile.renderSettings()
})
destinySelect.addEventListener("change", function () {
    thisFile.type = "Змінено користувачем"
    thisFile.destiny = destinySelect.value
    thisFile.renderSettings()
})
cowerSelect.addEventListener("change", function () {
    thisFile.type = "Змінено користувачем"
    thisFile.cower = cowerSelect.value
    thisFile.renderSettings()
})
bindingSelect.addEventListener("change", function () {
    thisFile.type = "Змінено користувачем"
    thisFile.binding = bindingSelect.value
    thisFile.renderSettings()
})
laminationSelect.addEventListener("change", function () {
    thisFile.type = "Змінено користувачем"
    thisFile.lamination = laminationSelect.value
    thisFile.renderSettings()
})
roundCornerSelect.addEventListener("change", function () {
    thisFile.type = "Змінено користувачем"
    thisFile.roundCorner = roundCornerSelect.value
    thisFile.renderSettings()
})
cuttingSelect.addEventListener("change", function () {
    thisFile.type = "Змінено користувачем"
    thisFile.cutting = cuttingSelect.value
    thisFile.renderSettings()
})


countInt.addEventListener("change", function () {
    thisFile._count = countInt.value
    thisFile.renderSettings()
})

sizeX.addEventListener("change", function () {
    if(sizeX.value < 45){
        sizeX.value = 45
    }
    if(sizeX.value > 310){
        sizeX.value = 310
    }
    thisFile.x = sizeX.value
    thisFile.format = "Свій розмір"
    thisFile.renderSettings()
})
sizeY.addEventListener("change", function () {
    if(sizeY.value < 45){
        sizeY.value = 45
    }
    if(sizeY.value > 440){
        sizeY.value = 440
    }
    thisFile.y = sizeY.value
    thisFile.format = "Свій розмір"
    thisFile.renderSettings()
})

let imgInp = document.querySelector("#imgInp")
let upload = document.querySelector("#upload")
let iframe = document.querySelector("#iframe")
let form = document.querySelector("#formmm")
let progressbar = document.querySelector("#progressbar")

upload.addEventListener("click", function () {
    document.querySelector("#status").innerText = ""
    let config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        response_type: "arraybuffer",
        onUploadProgress(progressEvent) {
            const progress = progressEvent.loaded / progressEvent.total * 100
            progressbar.value = progress
        }
    };
    if(imgInp.files[0]){
        let fd = new FormData();
        fd.append('file', imgInp.files[0], imgInp.files[0].name)
        axios.post("/upload", fd, config)
            .then(e => {
                console.log(e);
                console.log(e.data);
                let rrr = new Buffer()
                rrr.isBuffer(e.data)
                let file = reader.readAsText(e.data)
                // let uri = URL.createObjectURL(e.data)
                document.querySelector("#status").innerText = e.statusText
                // imgInp.value = ""
            })
    }
})
function renderr(uri){
    let list = document.querySelector(".list")
    let imgG = document.createElement("img")
    imgG.classList.add("lol")
    imgG.setAttribute("src", uri)
    list.appendChild(imgG)
}


async function postData(url, data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            // 'Content-Type': 'application/json'
            // 'Content-Type': 'application/octate-stream'
            'Content-Type': 'multipart/form-data'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
        body: data // body data type must match "Content-Type" header
    });
    await console.log(response);
    return await response.json(); // parses JSON response into native JavaScript objects
}
