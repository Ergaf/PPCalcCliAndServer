const upload = document.querySelector("#upload")
const download = document.querySelector("#download")
const modalCloseButton = document.querySelector("#modalCloseButton")
const nonUpload = document.querySelector("#nonUpload")
const ifPrintCountLists = document.querySelector("#ifPrintCountLists")
const allCountElement = document.querySelector("#allCountElement")
const addFileButton = document.querySelector("#addFileButton");
const storinki = document.querySelector("#storinki");
const list = document.querySelector(".list");
const orient = document.querySelector("#orient");
const stickerCutting = document.querySelector("#stickerCutting");
const stickerCuttingThis = document.querySelector("#stickerCuttingThis");
const arkushi = document.querySelector("#arkushi");
const primirnyk = document.querySelector("#primirnyk");
const containerForImgInServer = document.querySelector("#containerForImgInServer");
const containerForPdfInServer = document.querySelector("#containerForPdfInServer");
const settingsContainer = document.querySelector("#settingsContainer");
const mainDisplay = document.querySelector("#mainDisplay");
const digitalPrintingContainer = document.querySelector("#digitalPrintingContainer");
const selectButtonCalc = document.querySelector("#selectButtonCalc");
const digitalPrint = document.querySelector("#digitalPrint");
const widescreenPrint = document.querySelector("#widescreenPrint");
const fileClassCalcToModal = document.querySelector("#fileClassCalcToModal");
const toUseButtons = document.querySelector("#toUseButtons");
const destinyThisButtons = document.querySelector("#destinyThisButtons");
const toHomeButton = document.querySelector("#toHomeButton");
const toFilesButton = document.querySelector("#toFilesButton");
const photoRedactor = document.querySelector("#photoRedactor");
const luvers = document.querySelector("#luvers");
const bannerVarit = document.querySelector("#bannerVarit");
const floorLamination = document.querySelector("#floorLamination");
const widthLamination = document.querySelector("#widthLamination");
const rotateLeft = document.querySelector("#rotateLeft");
const rotateRight = document.querySelector("#rotateRight");
// const openEditor = document.querySelector("#openEditor");
const rotateNormal = document.querySelector("#rotateNormal");
const toastBody = document.querySelector("#toastBody");
const toastHeader = document.querySelector("#toastHeader");
const formatInputs = document.querySelector("#formatInputs");
const fileViewContainer = document.querySelector("#fileViewContainer");
const fileLoadModalBody = document.querySelector("#fileLoadModalBody");
rotateLeft.addEventListener("click", function () {
    thisFile.rotateImgFromNav = thisFile.rotateImgFromNav - 90
    renderListAndCard()
})
rotateRight.addEventListener("click", function () {
    thisFile.rotateImgFromNav = thisFile.rotateImgFromNav + 90
    renderListAndCard()
})
// openEditor.addEventListener("click", function () {
//
// })
rotateNormal.addEventListener("click", function () {
    thisFile.rotateImgFromNav = 0
    renderListAndCard()
})


toHomeButton.addEventListener("click", function () {
    digitalPrintingContainer.classList.add("d-none");
    mainDisplay.classList.remove("d-none");
    toHomeButton.classList.add("d-none");
    if (allFiles.length > 0) {
        toFilesButton.classList.remove("d-none");
    }
})
toFilesButton.addEventListener("click", function () {
    digitalPrintingContainer.classList.remove("d-none")
    mainDisplay.classList.add("d-none");
    toFilesButton.classList.add("d-none");
    toHomeButton.classList.remove("d-none");
    photoCalc.addClass('d-none');
})

function activateModal() {
    imgInp.classList.remove("notValid")
    document.querySelector("#uploadLoad").classList.add("d-none");
    upload.classList.remove("d-none");
    nonUpload.classList.remove("d-none");
    progressbar.value = 0
}

let calcType = ""
digitalPrint.addEventListener("click", event => {
    activateModal()
    fileClassCalcToModal.innerHTML = "Цифровий друк"
    calcType = "digital"
    upload.classList.remove("d-none")
    fileLoadModalBody.classList.remove("d-none")
})
widescreenPrint.addEventListener("click", event => {
    activateModal()
    fileClassCalcToModal.innerHTML = "Широкоформатний друк"
    calcType = "wide"
    upload.classList.remove("d-none")
    fileLoadModalBody.classList.remove("d-none")
})
// photoPrint.addEventListener("click", event => {
//     // activateModal()
//     // fileClassCalcToModal.innerHTML = "photo"
//     mainDisplay.classList.add("d-none");
//     photoCalc.classList.remove("d-none");
//
// })

const digitalCalcSelect = document.querySelector("#digitalCalcSelect");
const widelCalcSelect = document.querySelector("#widelCalcSelect");
const photoCalcSelect = document.querySelector("#photoCalcSelect");
digitalCalcSelect.addEventListener("click", event => {
    thisFile.calc = digitalCalcSelect.getAttribute("toFile")
    thisFile.renderSettings()
})
widelCalcSelect.addEventListener("click", event => {
    thisFile.calc = widelCalcSelect.getAttribute("toFile")
    thisFile.renderSettings()
})
photoCalcSelect.addEventListener("click", event => {
    thisFile.calc = photoCalcSelect.getAttribute("toFile")
    thisFile.renderSettings()
})

const allFiles = []
let thisFile;
let lastFileId;

orient.addEventListener("click", function () {
    if (thisFile.format === "custom") {
        let data = {
            id: thisFile._id,
            parameter: "x",
            parameter2: "y",
            value: thisFile.y,
            value2: thisFile.x,
        }
        sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
            if (o.status === "ok") {
                thisFile.x = sizeY.value
                thisFile.y = sizeX.value
                thisFile.orient = false
                thisFile.renderSettings()
            } else {
                showError(o)
            }
        })
        // let iks = thisFile.x
        // let igrik = thisFile.y
        // thisFile.x = igrik
        // thisFile.y = iks
    }
    let data = {
        id: thisFile._id,
        parameter: "orient",
        value: !thisFile.orient,
    }
    sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
        if (o.status === "ok") {
            thisFile.orient = !thisFile.orient
            thisFile.renderSettings()
        } else {
            showError(o)
        }
    })
    // thisFile.orient = !thisFile.orient
    // thisFile.renderSettings()
})

nonUpload.addEventListener("click", function () {
    let config = {
        data: {
            calc: calcType
        },
    };
    axios.post("/orders", config)
        .then(e => {
            // console.log(e.data);
            let file1 = new file(e.data.name, e.data.id, e.data.count)
            file1.format = e.data.format
            file1.countInFile = e.data.countInFile
            file1.calc = e.data.calc
            file1.url = e.data.url
            allFiles.push(file1)
            file1.createFileContainer()
            file1.pick({target: file1.container})
            document.querySelector(".settingsContainer").classList.remove("d-none")
            digitalPrintingContainer.classList.remove("d-none")
            mainDisplay.classList.add("d-none")
            toHomeButton.classList.remove("d-none");
            toFilesButton.classList.add("d-none");
        })
})
upload.addEventListener("click", function () {
    if (imgInp.value) {
        uploadFile(imgInp)
        imgInp.classList.remove("notValid")
        // data-bs-dismiss="modal"
    } else {
        event.preventDefault()
        imgInp.classList.add("notValid")
    }
})

// document.querySelector("#digitalCalcButton").addEventListener("click", e => {
//     uploadFile(document.querySelector("#digitalCalcInput"))
// })

function uploadFile(fileInput) {
    download.classList.remove("d-none");
    mainDisplay.classList.add("d-none");
    digitalPrintingContainer.classList.add("d-none");
    if (fileInput.files[0]) {
        // document.querySelector("#download").classList.remove("d-none")
        let config = {
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress(progressEvent) {
                const progress = progressEvent.loaded / progressEvent.total * 100
                progressbar.value = progress
                if (progress >= 100) {
                    document.querySelector("#uploadLoad").classList.remove("d-none");
                    upload.classList.add("d-none");
                    nonUpload.classList.add("d-none");
                }
            },
            data: {
                calc: calcType
            },
        };
        let fd = new FormData();
        fd.append(calcType, fileInput.files[0], fileInput.files[0].name)
        axios.post("/uploadFile", fd, config)
            .then(e => {
                mainDisplay.classList.add("d-none")
                digitalPrintingContainer.classList.remove("d-none")
                let file1 = new file(e.data.name, e.data.id, e.data.count)
                file1.url = e.data.url
                file1.calc = e.data.calc
                file1.format = e.data.format
                file1.countInFile = e.data.countInFile
                file1.canToOrder = e.data.canToOrder
                allFiles.push(file1)
                file1.createFileContainer()
                file1.pick({target: file1.container})
                // document.querySelector("#download").classList.add("d-none")

                document.querySelector("#uploadLoad").classList.add("d-none");
                upload.classList.remove("d-none");
                nonUpload.classList.remove("d-none");

                progressbar.value = 0
                download.classList.add("d-none");
                digitalPrintingContainer.classList.remove("d-none");
                toHomeButton.classList.remove("d-none");
                toFilesButton.classList.add("d-none");
                $("#exampleModal").modal("hide")
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
        let data = {
            id: thisFile._id,
            parameter: "sides",
            value: e.getAttribute("toFile")
        }
        sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
            if (o.status === "ok") {
                thisFile.sides = e.getAttribute("toFile")
                thisFile.renderSettings()
            } else {
                showError(o)
            }
        })
    })
});
Array.prototype.slice.call(colorButtons.children).forEach(e => {
    e.addEventListener("click", function () {
        let data = {
            id: thisFile._id,
            parameter: "color",
            value: e.getAttribute("toFile")
        }
        sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
            if (o.status === "ok") {
                thisFile.color = e.getAttribute("toFile")
                thisFile.renderSettings()
            } else {
                showError(o)
            }
        })
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
// fetch('https://script.googleusercontent.com/macros/echo?user_content_key=wLSQSatR6bZv9i8U5VtiOsa7GMSDGnnZijrnGFZE1_jwd1QJkdBz8Sl8ITa_TvVjVpf_ByOh6IcFuOZ7evsUSo_9NYtdFJYTm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDbwAl7CMxVAiYx-XcQGm2-pK98VFRlg2L1Bgi9-N5lGP8ipd0KGqDVV0UksueULwVpami56uyJ4IxkRYgJm5B_wls8-MAHEtdz9Jw9Md8uu&lib=MKqsPpMpIdvM_NE9JC918gzq7P1CHZY8E')
fetch('/getprices')
    .then(response => response.json())
    .then(json => {
        let x = 1
        let data = [];
        // json.forEach(e => {
        //     if (e[0] === '' || e[0] === null) {
        //         x = 1
        //     } else {
        //         if (x === 1) {
        //             data.push({
        //                 name: e[0],
        //                 variants: []
        //             })
        //             x = 0
        //         } else {
        //             data[data.length - 1].variants.push(e)
        //         }
        //     }
        // })
        // console.log(json);
        console.log(json)
        prices = json

        // toastBody.innerText = "Ціни завантажено з exel таблиці на Сервері."
        // toastHeader.innerText = "Print Peaks"
        // toast.show()

        fetch("/orders")
            .then(response => response.json())
            .then(json => {
                console.log(json);
                if (json) {
                    if (json.length !== 0) {
                        // mainDisplay.classList.add("d-none")
                        // digitalPrintingContainer.classList.remove("d-none")
                    }
                    json.forEach(o => {
                        let file1 = new file(o.name, o.id, o.count)
                        file1.url = o.url
                        file1.format = o.format
                        file1.calc = o.calc
                        file1.countInFile = o.countInFile
                        file1.sides = o.sides;
                        file1.color = o.color;
                        file1.cower = o.cower;
                        file1.paper = o.paper;
                        file1.destiny = o.destiny;
                        file1.destinyThis = o.destinyThis;
                        file1.binding = o.binding;
                        file1.bindingSelect = o.bindingSelect;
                        file1.lamination = o.lamination;
                        file1.roundCorner = o.roundCorner;
                        file1.frontLining = o.frontLining;
                        file1.backLining = o.backLining;
                        file1.big = o.big;
                        file1.holes = o.holes;
                        file1.countInFile = o.countInFile;
                        file1.allPaperCount = o.allPaperCount;
                        file1.orient = o.orient;
                        file1.stickerCutting = o.stickerCutting;
                        file1.stickerCuttingThis = o.stickerCuttingThis;
                        file1.x = o.x;
                        file1.y = o.y;
                        file1.url = o.url;
                        file1.list = o.list;
                        file1.calc = o.calc;
                        file1.touse = o.touse;
                        file1.luvers = o.luvers;
                        file1.bannerVarit = o.bannerVarit;
                        file1.floorLamination = o.floorLamination;
                        file1.widthLamination = o.widthLamination;
                        file1.price = o.price;
                        file1.canToOrder = o.canToOrder;
                        file1.inBasket = o.inBasket;

                        if(o.inBasket === false || o.inBasket === null || o.inBasket === 0){

                            allFiles.push(file1)
                            file1.createFileContainer()
                        } else {
                            filesInBasket.push(file1)
                            file1.createFileInBasketContainer()
                            basketNotification.innerHTML = parseInt(basketNotification.innerHTML)+1
                        }
                    })

                    download.classList.add("d-none")

                    if (allFiles.length > 0) {
                        mainDisplay.classList.add("d-none")
                        digitalPrintingContainer.classList.remove("d-none")
                        toFilesButton.classList.add("d-none");
                        toHomeButton.classList.remove("d-none");
                        // console.log(allFiles[0]);
                        allFiles[0].pick({target: allFiles[0].container})
                    } else {
                        mainDisplay.classList.remove("d-none")
                        digitalPrintingContainer.classList.add("d-none")
                        toFilesButton.classList.add("d-none");
                        toHomeButton.classList.add("d-none");
                    }
                    // sliderInit()
                }
            })
    })
let toast = new bootstrap.Toast($("#liveToast"))
let optContainer = document.querySelector(".optionsContainer")

countInt.addEventListener("change", function () {
    if (countInt.value < 1) {
        countInt.value = 1
    }
    let data = {
        id: thisFile._id,
        parameter: "count",
        value: countInt.value
    }
    sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
        if (o.status === "ok") {
            thisFile._count = countInt.value
            thisFile.renderSettings()
        } else {
            showError(o)
        }
    })
    // thisFile._count = countInt.value
    // thisFile.renderSettings()
})
countInt.addEventListener("wheel", function () {
    event.preventDefault();
    if (Math.sign(event.deltaY) === 1) {
        countInt.value = parseInt(countInt.value) - 1
    }
    if (Math.sign(event.deltaY) === -1) {
        countInt.value = parseInt(countInt.value) + 1
    }
    if (countInt.value < 1) {
        countInt.value = 1
    } else {
        let data = {
            id: thisFile._id,
            parameter: "count",
            value: countInt.value
        }
        sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
            if (o.status === "ok") {
                thisFile._count = countInt.value
                thisFile.renderSettings()
            } else {
                showError(o)
            }
        })
    }
    // thisFile._count = countInt.value
    // thisFile.renderSettings()
})

sizeX.addEventListener("change", function () {
    if (sizeX.value < 45) {
        sizeX.value = 45
    } else {
        if (thisFile.calc === "digital") {
            if (sizeX.value > 310) {
                if (sizeY.value > 310) {
                    sizeY.value = 310
                }
                if (sizeX.value > 440) {
                    sizeX.value = 440
                }
            }
        }
    }
    let data = {
        id: thisFile._id,
        parameter: "x",
        parameter2: "y",
        parameter3: "format",
        value: sizeX.value,
        value2: sizeY.value,
        value3: "custom"
    }
    sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
        if (o.status === "ok") {
            thisFile.x = sizeX.value
            thisFile.y = sizeY.value
            thisFile.format = "custom"
            thisFile.renderSettings()
        } else {
            showError(o)
        }
    })
})
sizeX.addEventListener("wheel", function () {
    event.preventDefault();
    if (Math.sign(event.deltaY) === 1) {
        sizeX.value = parseInt(sizeX.value) - 1
    }
    if (Math.sign(event.deltaY) === -1) {
        sizeX.value = parseInt(sizeX.value) + 1
    }
    if (sizeX.value < 45) {
        sizeX.value = 45
    }
    if (thisFile.calc === "digital") {
        if (sizeX.value > 310) {
            if (sizeY.value > 310) {
                sizeY.value = 310
            }
            if (sizeX.value > 440) {
                sizeX.value = 440
            }
        }
    }
    let data = {
        id: thisFile._id,
        parameter: "x",
        parameter2: "y",
        parameter3: "format",
        value: sizeX.value,
        value2: sizeY.value,
        value3: "custom"
    }
    sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
        if (o.status === "ok") {
            thisFile.x = sizeX.value
            thisFile.y = sizeY.value
            thisFile.format = "custom"
            thisFile.renderSettings()
        } else {
            showError(o)
        }
    })
})
sizeY.addEventListener("change", function () {
    if (sizeY.value < 45) {
        sizeY.value = 45
    }
    if (thisFile.calc === "digital") {
        if (sizeY.value > 310) {
            if (sizeX.value > 310) {
                sizeX.value = 310
            }
            if (sizeY.value > 440) {
                sizeY.value = 440
            }
        }
    }
    let data = {
        id: thisFile._id,
        parameter: "x",
        parameter2: "y",
        parameter3: "format",
        value: sizeX.value,
        value2: sizeY.value,
        value3: "custom"
    }
    sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
        if (o.status === "ok") {
            thisFile.x = sizeX.value
            thisFile.y = sizeY.value
            thisFile.format = "custom"
            thisFile.renderSettings()
        } else {
            showError(o)
        }
    })
})
sizeY.addEventListener("wheel", function () {
    event.preventDefault();
    if (Math.sign(event.deltaY) === 1) {
        sizeY.value = parseInt(sizeY.value) - 1
    }
    if (Math.sign(event.deltaY) === -1) {
        sizeY.value = parseInt(sizeY.value) + 1
    }
    if (sizeY.value < 45) {
        sizeY.value = 45
    }
    if (thisFile.calc === "digital") {
        if (sizeY.value > 310) {
            if (sizeX.value > 310) {
                sizeX.value = 310
            }
            if (sizeY.value > 440) {
                sizeY.value = 440
            }
        }
    }
    let data = {
        id: thisFile._id,
        parameter: "x",
        parameter2: "y",
        parameter3: "format",
        value: sizeX.value,
        value2: sizeY.value,
        value3: "custom"
    }
    sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
        if (o.status === "ok") {
            thisFile.x = sizeX.value
            thisFile.y = sizeY.value
            thisFile.format = "custom"
            thisFile.renderSettings()
        } else {
            showError(o)
        }
    })
})

let imgInp = document.querySelector("#imgInp")
let iframe = document.querySelector("#iframe")
let form = document.querySelector("#formmm")
let progressbar = document.querySelector("#progressbar")

async function sendData(url, method, data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8',
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


// var imageEditor = new tui.component.ImageEditor('#my-image-editor canvas', {
//     cssMaxWidth: 1000, // Component default value: 1000
//     cssMaxHeight: 800, // Component default value: 800
// });
//
// imageEditor.loadImageFromURL('files/totest/file-1.png', 'My sample image');

addEventListener("popstate", function (e) {
    alert('yeees!');
}, false);


function showError(error) {
    toastBody.innerText = error.status
    toastHeader.innerText = error.error
    toast.show()
}


// var canvas = document.querySelector('#canvas1');
// var gl = canvas.getContext('webgl');
//
// // Создание вершинных данных для куба
// var vertices = [
//     -1, -1, -1,
//     -1, -1,  1,
//     -1,  1,  1,
//     1,  1, -1,
//     -1, -1, -1,
//     -1,  1, -1,
//     1, -1,  1,
//     -1, -1, -1,
//     1, -1, -1,
//     1,  1, -1,
//     1, -1, -1,
//     -1, -1, -1,
//     -1, -1, -1,
//     -1,  1,  1,
//     -1,  1, -1,
//     1, -1,  1,
//     -1, -1,  1,
//     -1, -1, -1,
//     -1,  1,  1,
//     -1, -1,  1,
//     1, -1,  1,
//     1,  1,  1,
//     1, -1, -1,
//     1,  1, -1,
//     1, -1, -1,
//     1,  1,  1,
//     1, -1,  1,
//     1,  1,  1,
//     1,  1, -1,
//     -1,  1, -1,
//     1,  1,  1,
//     -1,  1, -1,
//     -1,  1,  1,
//     1,  1,  1,
//     -1,  1,  1,
//     1, -1,  1
// ];
//
// // Создание буфера вершинных данных
// var vertex_buffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//
// // Создание и компиляция шейдеров
// var vertCode =
//     'attribute vec3 position;' +
//     'void main(void) {' +
//     ' gl_Position = vec4(position, 1.0);' +
//     '}';
// var fragCode ='void main(void) {' +
//     ' gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);' +
//     '}';
//
// var vertShader = gl.createShader(gl.VERTEX_SHADER);
// gl.shaderSource(vertShader, vertCode);
// gl.compileShader(vertShader);
//
// var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
// gl.shaderSource(fragShader, fragCode);
// gl.compileShader(fragShader);
//
// // Создание и сборка программы из шейдеров
// var shaderProgram = gl.createProgram();
// gl.attachShader(shaderProgram, vertShader);
// gl.attachShader(shaderProgram, fragShader);
// gl.linkProgram(shaderProgram);
// gl.useProgram(shaderProgram);
//
// // Получение ссылки на атрибут вершин
// var positionAttrib = gl.getAttribLocation(shaderProgram, "position");
// gl.enableVertexAttribArray(positionAttrib);
// gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
// gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
//
// // Очистка экрана и отрисовка куба
// gl.clearColor(0.0, 0.0, 0.0, 1.0);
// gl.enable(gl.DEPTH_TEST);
// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// gl.drawArrays(gl.TRIANGLES, 0, 36);
//
// function rotateXMatrix(angle) {
//     var c = Math.cos(angle);
//     var s = Math.sin(angle);
//
//     return [
//         1, 0, 0, 0,
//         0, c, s, 0,
//         0, -s, c, 0,
//         0, 0, 0, 1
//     ];
// }
//
// function rotateYMatrix(angle) {
//     var c = Math.cos(angle);
//     var s = Math.sin(angle);
//
//     return [
//         c, 0, -s, 0,
//         0, 1, 0, 0,
//         s, 0, c, 0,
//         0, 0, 0, 1
//     ];
// }
//
// function rotateZMatrix(angle) {
//     var c = Math.cos(angle);
//     var s = Math.sin(angle);
//
//     return [
//         c, s, 0, 0,
//         -s, c, 0, 0,
//         0, 0, 1, 0,
//         0, 0, 0, 1
//     ];
// }
//
// var modelMatrix = [
//     1, 0, 0, 0,
//     0, 1, 0, 0,
//     0, 0, 1, 0,
//     0, 0, 0, 1
// ];
//
// var angle = Math.PI / 4; // 45 градусов в радианах
// var rotateX = rotateXMatrix(angle);
//
// // Умножение матрицы поворота на матрицу модели
// modelMatrix = multiplyMatrices(modelMatrix, rotateX);
//
// function multiplyMatrices(a, b) {
//     var a00 = a[0 * 4 + 0];
//     var a01 = a[0 * 4 + 1];
//     var a02 = a[0 * 4 + 2];
//     var a03 = a[0 * 4 + 3];
//     var a10 = a[1 * 4 + 0];
//     var a11 = a[1 * 4 + 1];
//     var a12 = a[1 * 4 + 2];
//     var a13 = a[1 * 4 + 3];
//     var a20 = a[2 * 4 + 0];
//     var a21 = a[2 * 4 + 1];
//     var a22 = a[2 * 4 + 2];
//     var a23 = a[2 * 4 + 3];
//     var a30 = a[3 * 4 + 0];
//     var a31 = a[3 * 4 + 1];
//     var a32 = a[3 * 4 + 2];
//     var a33 = a[3 * 4 + 3];
//     var b00 = b[0 * 4 + 0];
//     var b01 = b[0 * 4 + 1];
//     var b02 = b[0 * 4 + 2];
//     var b03 = b[0 * 4 + 3];
//     var b10 = b[1 * 4 + 0];
//     var b11 = b[1 * 4 + 1];
//     var b12 = b[1 * 4 + 2];
//     var b13 = b[1 * 4 + 3];
//     var b20 = b[2 * 4 + 0];
//     var b21 = b[2 * 4 + 1];
//     var b22 = b[2 * 4 + 2];
//     var b23 = b[2 * 4 + 3];
//     var b30 = b[3 * 4 + 0];
//     var b31 = b[3 * 4 + 1];
//     var b32 = b[3 * 4 + 2];
//     var b33 = b[3 * 4 + 3];
//
//     return [
//         a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
//         a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
//         a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
//         a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
//         a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
//         a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
//         a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
//         a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
//         a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
//         a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
//         a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
//         a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
//         a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
//         a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
//         a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
//         a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33,
//     ];
// }