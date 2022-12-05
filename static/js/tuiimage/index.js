let backInTui = $('#backInTui');
backInTui.on("click", ev => {
    photoRedactor.classList.add("d-none");
    // mainDisplay.classList.remove("d-none");
    digitalPrintingContainer.classList.remove("d-none");
})

// tui.usageStatistics = false;
// let imageEditor = new tui.ImageEditor('#tui', {
//     cssMaxWidth: 1100,
//     cssMaxHeight: 600,
//     selectionStyle: {
//         cornerSize: 20,
//         rotatingPointOffset: 70,
//     },
//     // includeUI: {
//     //     loadImage: {
//     //         path: '/files/totest/errorNoFormat.png',
//     //         name: 'SampleImage'
//     //     },
//     //     theme: whiteTheme, // or blackTheme
//     //     // menu: ['shape', 'filter'],
//     //     // initMenu: 'filter',
//     //     uiSize: {
//     //         width: '100%',
//     //         height: '95vh'
//     //     },
//     //     menuBarPosition: 'left',
//     //     selectionStyle: {
//     //         cornerSize: 20,
//     //         rotatingPointOffset: 70
//     //     }
//     // },
// });

openEditor.addEventListener("click", event => {
    // activateModal()
    // fileClassCalcToModal.innerHTML = "photo"
    if(!thisFile.url2.pdf && thisFile.url.url){
        mainDisplay.classList.add("d-none");
        photoRedactor.classList.remove("d-none");
        digitalPrintingContainer.classList.add("d-none");
        imageEditor.loadImageFromURL(thisFile.url.url, 'SampleImage').then(function (sizeValue) {
            imageEditor.clearUndoStack();
            // console.log(sizeValue);
        })

    }
})


$('#saveChanges').on('click', function () {
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
                progressbar.value = progress
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
        axios.post("/upload4", fd, config)
            .then(e => {
                // console.log(e);
                thisFile.url.url = e.data
                thisFile.renderSettings()
                photoRedactor.classList.add('d-none');
                digitalPrintingContainer.classList.remove("d-none");
            })



        //   if (imageName.split('.').pop() !== type) {
        //     imageName += '.' + type;
        //   }
        //
        //   // Library: FileSaver - saveAs
        //   saveAs(blob, imageName); // eslint-disable-line
        // } else {
        //   alert('This browser needs a file-server');
        //   w = window.open();
        //   w.document.body.innerHTML = '<img src="' + dataURL + '">';
    }
});



