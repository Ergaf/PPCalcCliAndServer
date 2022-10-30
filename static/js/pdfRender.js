function render() {
    thisFile.url2.pdf.getPage(thisFile.url2.currentPage).then((page) => {
        let canvas = document.getElementById("pdf_renderer");
        let ctx = canvas.getContext("2d");

        let viewport = page.getViewport(thisFile.url2.zoom);

        // more code here
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        page.render({
            canvasContext: ctx,
            viewport: viewport
        });
        document.querySelector("#page_count").innerText = thisFile.url2.pdf.numPages
    });
}

document.getElementById("go_previous").addEventListener("click", (e) => {
    if(thisFile.url2.pdf !== null && thisFile.url2.currentPage > 1){
        thisFile.url2.currentPage -= 1;
        document.getElementById("current_page").value = thisFile.url2.currentPage;
        render();
    }
});

document.getElementById("go_next").addEventListener("click", (e) => {
    if(thisFile.url2.pdf !== null && thisFile.url2.currentPage < thisFile.url2.pdf.numPages){
        thisFile.url2.currentPage += 1;
        document.getElementById("current_page").value = thisFile.url2.currentPage;
        render();
    }
});

let currentPage = document.getElementById("current_page")
currentPage.addEventListener("change", (e) => {
    if(thisFile.url2.pdf){
        if(currentPage.value > thisFile.url2.pdf.numPages){
            currentPage.value = thisFile.url2.pdf.numPages
        }
        if(currentPage.value < 1){
            currentPage.value = 1
        }

        // if(currentPage <= thisFile.url2.pdf.numPages && currentPage > 0){
            thisFile.url2.currentPage = parseInt(currentPage.value);
        // }
        render();
    }
    currentPage.value = 1
});

currentPage.addEventListener("wheel", function () {
    event.preventDefault();
    if(thisFile.url2.pdf){
        if(Math.sign(event.deltaY) === 1){
            currentPage.value = parseInt(currentPage.value)-1
        }
        if(Math.sign(event.deltaY) === -1){
            currentPage.value = parseInt(currentPage.value)+1
        }

        if(currentPage.value < 1){
            currentPage.value = 1
        }
        if(currentPage.value > thisFile.url2.pdf.numPages){
            currentPage.value = thisFile.url2.pdf.numPages
        }
        thisFile.url2.currentPage = parseInt(currentPage.value)
        render();
    }
})

document.getElementById("zoom_in").addEventListener("click", (e) => {
    if(thisFile.url2.pdf){
        thisFile.url2.zoom += 0.1;
        render();
    }
});
document.getElementById("zoom_out").addEventListener("click", (e) => {
    if(thisFile.url2.pdf){
        thisFile.url2.zoom -= 0.1;
        render();
    }
});
document.getElementById("zoom_normal").addEventListener("click", (e) => {
    if(thisFile.url2.pdf){
        thisFile.url2.zoom = 1;
        render();
    }
});