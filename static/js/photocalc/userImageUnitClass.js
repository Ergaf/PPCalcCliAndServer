class userImageUnit {
    file;
    container;
    progressBar;

    constructor(img) {
        this.container = document.createElement("div");
        this.container.classList.add("card");
        this.container.style.cssText = "width: 19.5vw; height: 22.3vw;";
        containerForUserImg.append(this.container);
        this.container.innerHTML = img;
        // this.progressBar = document.createElement("progress");
        // this.progressBar.setAttribute("max", "100");
        // this.progressBar.value = 0;
        // this.progressBar.style.cssText = "width: 100%;"
        // // this.progressBar.classList.add("invisible");
        // this.container.append(this.progressBar)

        // this.container = container
        this.container.onmousedown = this.deleteThis.bind( this);
    }

    deleteThis(e) {
        if(e.target.getAttribute("close")){
            for(let i = 0; i < photoArrContainer.length; i++){
                if(photoArrContainer[i].container === this.container){
                    this.container.remove()
                    photoArrContainer.splice(i, 1)
                    if(photoArrContainer.length < 1){
                        saveControls.addClass("d-none")
                    }
                }
            }
        }
    }

    uploadThis() {
        // this.progressbar.classList.remove("invisible")
        let config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            // onUploadProgress(progressEvent) {
            //     const progress = progressEvent.loaded / progressEvent.total * 100
            //     this.progressBar.value = progress
            // },
        };

        let fd = new FormData();
        fd.append("photo", this.file)
        axios.post("/uploadFile", fd, config)
            .then(e => {
                console.log(e);
                if(photoArrContainer.length > 0){
                    photoArrContainer.splice(0, 1)
                    this.container.style.background = "rgb(193, 250, 141);"
                    if(photoArrContainer.length > 0){
                        photoArrContainer[0].uploadThis()
                    }
                }
                if(photoArrContainer.length === 0) {
                    containerForUserImg.html("")
                    photoCalc.addClass("d-none");
                    saveControls.addClass("d-none")
                    digitalPrintingContainer.classList.remove("d-none");
                }

                let file1 = new file(e.data.name, e.data.id)
                file1.url = e.data.url
                file1.calc = e.data.calc
                file1.format = e.data.format
                file1.countInFile = e.data.countInFile
                allFiles.push(file1)
                file1.createFileContainer()

                // thisFile.url.url = e.data
                // thisFile.renderSettings()
                // photoRedactor.classList.add('d-none');
                // digitalPrintingContainer.classList.remove("d-none");
            })
    }
}