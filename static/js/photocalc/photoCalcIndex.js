let backInPhotoCalcButton = $('#backInPhotoCalcButton')
let photoCalc = $('#photoCalc')
let photoPrint = $('#photoPrint')

photoPrint.on('click', function() {
    photoCalc.removeClass('d-none');
    mainDisplay.classList.add('d-none');
})
backInPhotoCalcButton.on('click', function() {
    photoCalc.addClass('d-none');
    mainDisplay.classList.remove('d-none');
})