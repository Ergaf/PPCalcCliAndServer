let backInPhotoCalcButton = $('#backInPhotoCalcButton');
let photoCalc = $('#photoCalc');
let photoPrint = $('#photoPrint');
let inMemory = $('#inMemory');
let containerForUserImg = $('#containerForUserImg');
let saveControls = $('#saveControls');
let saveAllUserPhoto = $('#saveAllUserPhoto');
let deleteAllUserPhoto = $('#deleteAllUserPhoto');
let notFilePhoto = $('#notFilePhoto');
let photoArrContainer = [];

notFilePhoto.on('click', function (){
    let config = {
        data: {
            calc: "photo"
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
            photoCalc.addClass('d-none');
        })
})

photoPrint.on('click', function() {
    photoCalc.removeClass('d-none');
    mainDisplay.classList.add('d-none');
})
backInPhotoCalcButton.on('click', function() {
    photoCalc.addClass('d-none');
    mainDisplay.classList.remove('d-none');
})
saveAllUserPhoto.on('click', function() {
    photoArrContainer[0].uploadThis()
})
deleteAllUserPhoto.on('click', function() {
    photoArrContainer = [];
    containerForUserImg.html("")
    saveControls.addClass("d-none")
})
inMemory.on('click', function () {
    inMemory.get(0).value = ""
})
inMemory.on('change', function () {
    if(inMemory.get(0).files.length > 0){
        saveControls.removeClass("d-none")
    } else {
        saveControls.addClass("d-none")
    }
    for (let i = 0; i < inMemory.get(0).files.length; i++){
        // console.log(inMemory.get(0).files[i]);
        let file = inMemory.get(0).files[i];
        let reader = new FileReader();
        console.log(file.type);
        if (file.type === 'image/jpeg'
            || file.type === 'image/png'
            || file.type === 'image/x-png'
            || file.type === 'image/x-jpeg'
            || file.type === 'image/jpg'
            || file.type === 'image/x-jpg'
        ){
            reader.onload = function (aImg) {
                //создаю елемент
                console.log(aImg);


                var imgg = new Image();
                imgg.onload = function() {
                    let width = this.width;
                    let hight = this.height;

                    let coef = hight/width
                    let widthAfterCoef = 100
                    console.log(coef);
                    if(coef > 1){
                        widthAfterCoef = 100/coef
                    }
                    console.log(coef);
                    console.log(widthAfterCoef);
                    let img = `<div class="d-flex flex-row justify-content-end mt-1 mb-1">
                                  <button type="button" close="true" class="btn-close" aria-label="Close"></button>
                               </div>
                               <div class="d-flex justify-content-center align-items-center" style="height: 17vw">
                                   <img src="${aImg.target.result}" style="width: ${widthAfterCoef}%; pointer-events: none;" alt="...">
                               </div>
                               <div class="card-body"></div>`;
                    //оздаю класс для реализации удаления
                    let fileUnit = new userImageUnit(img);
                    fileUnit.file = file;
                    // fileUnit.container.innerHTML = img
                    photoArrContainer.push(fileUnit);
                }
                imgg.src = aImg.target.result;
            }
            reader.readAsDataURL(file);
        }
    }
})