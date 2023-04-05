let backInTui = $('#backInTui');
let tuiImageEditorForCss = document.querySelector("#tui-image-editor")
let progressbarRedact = document.querySelector("#progressbarRedact")
let btnCrop = $('#btnCrop');
let btnApplyCrop = $('#btnApplyCrop');
let btnCancelCrop = $('#btnCancelCrop');
let activateCrop = $('#activateCrop');
// backInTui.on("click", ev => {
//     photoRedactor.classList.add("d-none");
//     // mainDisplay.classList.remove("d-none");
//     digitalPrintingContainer.classList.remove("d-none");
// })

// let imageEditor = new tui.ImageEditor('.tui-image-editor', {
//     cssMaxWidth: 700,
//     cssMaxHeight: 500,
//     selectionStyle: {
//         cornerSize: 20,
//         rotatingPointOffset: 70,
//     },
// });


btnCrop.on('click', function () {
    if(!thisFile.url2.pdf && thisFile.url.url){
        // mainDisplay.classList.add("d-none");
        // photoRedactor.classList.remove("d-none");
        // digitalPrintingContainer.classList.add("d-none");
        $("#redactorModal").modal("show")
        let url = '';
        if(thisFile.url.urlOriginal){
            url = thisFile.url.urlOriginal
        } else {
            url = thisFile.url.url
        }
        imageEditor.loadImageFromURL(url, 'SampleImage').then(function (sizeValue) {
            imageEditor.clearUndoStack();
            imageEditor.stopDrawingMode();
            imageEditor.startDrawingMode('CROPPER');
            progressbarRedact.value = 0
            btnCancelCrop.addClass("d-none");
            btnApplyCrop.addClass("d-none");
            activateCrop.removeClass("d-none");
        })
    }
});

btnApplyCrop.on('click', function () {
    imageEditor.crop(imageEditor.getCropzoneRect()).then(function () {
        imageEditor.stopDrawingMode();
        resizeEditor();
        btnCancelCrop.addClass("d-none");
        btnApplyCrop.addClass("d-none");
        activateCrop.removeClass("d-none");
    });
});

btnCancelCrop.on('click', function () {
    imageEditor.stopDrawingMode();
    btnCancelCrop.addClass("d-none");
    btnApplyCrop.addClass("d-none");
    activateCrop.removeClass("d-none");
});

activateCrop.on('click', function () {
    imageEditor.startDrawingMode('CROPPER');
    activateCrop.addClass("d-none");
    btnCancelCrop.removeClass("d-none");
    btnApplyCrop.removeClass("d-none");
});

// let btnCrop = $('#btn-crop')
// $btnCrop.on("click", event => {
//     // activateModal()
//     if(!thisFile.url2.pdf && thisFile.url.url){
//         // mainDisplay.classList.add("d-none");
//         // photoRedactor.classList.remove("d-none");
//         // digitalPrintingContainer.classList.add("d-none");
//         $("#redactorModal").modal("show")
//         imageEditor.loadImageFromURL(thisFile.url.url, 'SampleImage').then(function (sizeValue) {
//             imageEditor.clearUndoStack();
//             // console.log(sizeValue);
//
//             // var imgg = new Image();
//             // imgg.onload = function() {
//             //     let width = this.width;
//             //     let hight = this.height;
//             //
//             //     let coef = hight / width
//             //     if (coef < 1) {
//             //         let widthAfterCoef = 40 / coef
//             //         // tuiImageEditorForCss.style.width = widthAfterCoef+"vw"
//             //     } else {
//             //         let widthAfterCoef = 40 * coef
//             //         // tuiImageEditorForCss.style.width = widthAfterCoef+"vw"
//             //     }
//             //     console.log(coef);
//             //
//             //     // tuiImageEditorForCss.style.height = 40+"vw"
//             // }
//             // imgg.src = thisFile.url.url;
//             // tuiImageEditorForCss.style.padding = "20vh"
//             // tuiImageEditor.classList.add("tui-image-editor");
//         })
//     }
// })

$('#saveChanges').on('click', function () {
    // var imageName = imageEditor.getImageName();
    // var dataURL = imageEditor.toDataURL();
    // var blob, type, w;
    //
    // if (supportingFileAPI) {
    //     blob = base64ToBlob(dataURL);
    //     type = blob.type.split('/')[1];
    //     let config = {
    //         headers: { 'Content-Type': 'multipart/form-data' },
    //         response_type: "arraybuffer",
    //         onUploadProgress(progressEvent) {
    //             const progress = progressEvent.loaded / progressEvent.total * 100
    //             progressbarRedact.value = progress
    //             if(progress >= 100){
    //                 document.querySelector("#uploadLoad").classList.remove("d-none");
    //                 upload.classList.add("d-none");
    //                 nonUpload.classList.add("d-none");
    //             }
    //         },
    //         data: {
    //             calc: fileClassCalcToModal.innerHTML
    //         },
    //     };
    //     let fd = new FormData();
    //     fd.append(thisFile._id, blob, imageName)
    //     axios.post("/uploadRedactedFile", fd, config)
    //         .then(e => {
    //             // console.log(e);
    //             thisFile.url.url = e.data
    //             thisFile.renderSettings()
    //             $("#redactorModal").modal("hide")
    //             // photoRedactor.classList.add('d-none');
    //             // digitalPrintingContainer.classList.remove("d-none");
    //         })
    // }


    imageEditor.crop(imageEditor.getCropzoneRect()).then(function () {
        imageEditor.stopDrawingMode();
        resizeEditor();


        var imageName = imageEditor.getImageName();
        var dataURL = imageEditor.toDataURL();
        var blob, type, w;

        if (supportingFileAPI) {
            blob = base64ToBlob(dataURL);
            type = blob.type.split('/')[1];
            let config = {
                headers: { 'Content-Type': 'multipart/form-data' },
                response_type: "arraybuffer",
                onUploadProgress(progressEvent) {
                    const progress = progressEvent.loaded / progressEvent.total * 100
                    progressbarRedact.value = progress
                    if(progress >= 100){
                        document.querySelector("#uploadLoad").classList.remove("d-none");
                        upload.classList.add("d-none");
                        nonUpload.classList.add("d-none");
                    }
                },
                data: {
                    calc: fileClassCalcToModal.innerHTML
                },
            };
            let fd = new FormData();
            fd.append(thisFile._id, blob, imageName)
            axios.post("/uploadRedactedFile", fd, config)
                .then(e => {
                    console.log(e);
                    thisFile.url.url = e.data
                    thisFile.renderSettings()
                    $("#redactorModal").modal("hide")
                    // photoRedactor.classList.add('d-none');
                    // digitalPrintingContainer.classList.remove("d-none");
                })
        }

    });
});



