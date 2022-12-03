let backInTui = $('#backInTui');
backInTui.on("click", ev => {
    photoCalc.classList.add("d-none");
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
        photoCalc.classList.remove("d-none");
        digitalPrintingContainer.classList.add("d-none");
        imageEditor.loadImageFromURL(thisFile.url.url, 'SampleImage').then(function (sizeValue) {
            imageEditor.clearUndoStack();
            console.log(sizeValue);
        })

    }
})



