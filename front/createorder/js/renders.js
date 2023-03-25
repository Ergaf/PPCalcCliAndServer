function renderListIfImg(x, y, list, containerForImg, img) {
    list.style.transform = ""
    list.style.opacity = "1"

    let etalon = 145;
    let coef = y / x
    let width = etalon / coef;
    let etalonForRender = 145

    containerForImg.style.transform = ""

    let imgCoef = img.naturalHeight / img.naturalWidth

    // img.style = ''

    if (imgCoef >= coef) {
        let newImgCoef = 100 * coef / imgCoef
        img.style.width = newImgCoef + "%"
    } else {
        img.style.width = 100 + "%"
    }

    if (coef < 1) {
        let newImgCoef = 100 * coef / imgCoef
        let coef1 = coef

        coef = x / y
        width = etalon / coef;

        list.style.transform = "rotate(90deg)"
        containerForImg.style.transform = `rotate(-90deg)`


        if (imgCoef >= coef1) {
            img.style.width = newImgCoef * coef + "%"
        } else {
            img.style.width = 100 / coef1 + "%"
        }

    } else {
        // containerForImg.style.transform = `rotate(-90deg)`
    }

    list.style.width = width + "px"
    list.style.minWidth = width + "px"
    list.style.height = etalonForRender + "px"
    list.style.minHeight = etalonForRender + "px"
    list.style.background = "#ffffff";

    if (coef <= 1) {

    }
    // else {
    //     list.style.opacity = "0"
    // }
}

function renderListIfPdf(x, y, list, containerForPdf, pdff, myPdf, PdfRenderer, thisFile) {

    list.style.transform = ""
    list.style.opacity = "1"

    let etalon = 145;
    let coef = y / x
    let width = etalon / coef;
    let etalonForRender = 145

    containerForPdf.style.transform = ""

    let pdfCoef = 1
    if (viewportHeight && viewportWidth) {
        pdfCoef = viewportHeight / viewportWidth
    }

    //-----------------PDF-----------------------------------------------
    if (pdfCoef >= coef) {
        let newPdfCoef = 100 * coef / pdfCoef
        PdfRenderer.style.width = newPdfCoef + "%"
        myPdf.style.width = newPdfCoef + "%"
        pdff.style.width = newPdfCoef + "%"
    } else {
        PdfRenderer.style.width = 100 + "%"
        myPdf.style.width = 100 + "%"
        pdff.style.width = 100 + "%"
    }

    if (coef < 1) {
        let newPdfCoef = 100 * coef / pdfCoef
        let coef1 = coef

        coef = x / y
        width = etalon / coef;

        list.style.transform = "rotate(90deg)"
        containerForPdf.style.transform = `rotate(-90deg)`

        if (pdfCoef >= coef1) {
            PdfRenderer.style.width = newPdfCoef * coef + "%"
            myPdf.style.width = newPdfCoef * coef + "%"
            pdff.style.width = newPdfCoef * coef + "%"
        } else {
            PdfRenderer.style.width = 100 / coef1 + "%"
            myPdf.style.width = 100 / coef1 + "%"
            pdff.style.width = 100 / coef1 + "%"
        }
    } else {
        // containerForPdf.style.transform = `rotate(${thisFile.rotateImgFromNav}deg)`
    }

    list.style.width = width + "px"
    list.style.minWidth = width + "px"
    list.style.height = etalonForRender + "px"
    list.style.minHeight = etalonForRender + "px"
    list.style.background = "#ffffff";

    if (coef <= 1) {
        // etalon = etalon/coef
        // imgInServer.style = ''
        // imgInServer.style.width = 100+"%"
    }
    // document.body.append(containerForImgInServer);
}


function renderPdfInBasket(thisFile, canvas, list, containerForPdf, pdff, myPdf) {

    thisFile.url2.pdf.getPage(thisFile.url2.currentPage).then((page) => {
        let ctx = canvas.getContext("2d");

        let viewport = page.getViewport(thisFile.url2.zoom);

        // more code here
        canvas.width = viewport.width;
        viewportWidth = viewport.width;
        canvas.height = viewport.height;
        viewportHeight = viewport.height;

        page.render({
            canvasContext: ctx,
            viewport: viewport
        });
        // document.querySelector("#page_count").innerText = thisFile.url2.pdf.numPages
        // thisFile.countInFile = thisFile.url2.pdf.numPages
    });
    // renderListAndCard()
    // renderListIfPdf(this.x, this.y, list, containerForPdf, pdff, myPdf)
}

// document.getElementById("go_previous").addEventListener("click", (e) => {
//     if(thisFile.url2.pdf !== null && thisFile.url2.currentPage > 1){
//         thisFile.url2.currentPage -= 1;
//         document.getElementById("current_page").value = thisFile.url2.currentPage;
//         render();
//     }
// });
//
// document.getElementById("go_next").addEventListener("click", (e) => {
//     if(thisFile.url2.pdf !== null && thisFile.url2.currentPage < thisFile.url2.pdf.numPages){
//         thisFile.url2.currentPage += 1;
//         document.getElementById("current_page").value = thisFile.url2.currentPage;
//         render();
//     }
// });
//
// let currentPage = document.getElementById("current_page")
// currentPage.addEventListener("change", (e) => {
//     if(thisFile.url2.pdf){
//         if(currentPage.value > thisFile.url2.pdf.numPages){
//             currentPage.value = thisFile.url2.pdf.numPages
//         }
//         if(currentPage.value < 1){
//             currentPage.value = 1
//         }
//
//         // if(currentPage <= thisFile.url2.pdf.numPages && currentPage > 0){
//         thisFile.url2.currentPage = parseInt(currentPage.value);
//         // }
//         render();
//     }
//     else {
//         currentPage.value = 1
//     }
// });
//
// currentPage.addEventListener("wheel", function () {
//     event.preventDefault();
//     if(thisFile.url2.pdf){
//         if(Math.sign(event.deltaY) === 1){
//             if(currentPage.value > 1){
//                 currentPage.value = parseInt(currentPage.value)-1
//
//                 if(currentPage.value < 1){
//                     currentPage.value = 1
//                 }
//                 if(currentPage.value > thisFile.url2.pdf.numPages){
//                     currentPage.value = thisFile.url2.pdf.numPages
//                 }
//                 thisFile.url2.currentPage = parseInt(currentPage.value)
//                 render();
//             }
//         }
//         if(Math.sign(event.deltaY) === -1){
//             if(currentPage.value < thisFile.url2.pdf.numPages){
//                 currentPage.value = parseInt(currentPage.value)+1
//
//                 if(currentPage.value < 1){
//                     currentPage.value = 1
//                 }
//                 if(currentPage.value > thisFile.url2.pdf.numPages){
//                     currentPage.value = thisFile.url2.pdf.numPages
//                 }
//                 thisFile.url2.currentPage = parseInt(currentPage.value)
//                 render();
//             }
//         }
//     }
// })
//
// document.getElementById("zoom_in").addEventListener("click", (e) => {
//     if(thisFile.url2.pdf){
//         thisFile.url2.zoom += 0.1;
//         render();
//     }
// });
// document.getElementById("zoom_out").addEventListener("click", (e) => {
//     if(thisFile.url2.pdf){
//         thisFile.url2.zoom -= 0.1;
//         render();
//     }
// });
// document.getElementById("zoom_normal").addEventListener("click", (e) => {
//     if(thisFile.url2.pdf){
//         thisFile.url2.zoom = 1;
//         render();
//     }
// });