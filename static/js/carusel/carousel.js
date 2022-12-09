function sliderInit() {
    let sliderPosition = 0; // начальная позиция дорожки
    let sliderContainer = $('.slider-container');
    let sliderTrack = $('.slider-track');
    let sliderItem = $('.slider-item');
    let sliderItemWidth = sliderItem.width();
    let sliderContainerWidth = sliderContainer.width();
    // ширина дорожки определяется как разница между шириной всех картинок и шириной контейнера
    // разница нужна для того, чтобы прокрутка не проводилась дальше последнего фото
    let sliderTrackWidth = sliderItem.length * sliderItemWidth - sliderContainerWidth;
    let sliderButtonPrev = $('.arrow-left');
    let sliderButtonNext = $('.arrow-right');
    sliderButtonPrev.on('click', function(){
        sliderPosition += sliderItemWidth; // увеличиваем отступ при нажатии назад
        // поскольку отступ будет всегда отрицательный, нужно сравнивать с нулем,
        // чтобы исключить пустые прокрутки
        if (sliderPosition > 0) {
            sliderPosition = 0;
        }
        sliderTrack.css('transform', `translateX(${sliderPosition}px`);
        sliderButtons();
    });
    sliderButtonNext.on('click', function(){
        sliderPosition -= sliderItemWidth;
        // так как отступы отрицательные, нужно сравнить с отрицательной длинной дорожки,
        // чтобы исключить пустые прокрутки
        if (sliderPosition < -sliderTrackWidth) {
            sliderPosition = -sliderTrackWidth;
        }
        sliderTrack.css('transform', `translateX(${sliderPosition}px`);
        sliderButtons();
    });
    // скрываем кнопки prev/next, когда нельзя больше крутить
    let sliderButtons = () => {
        if (sliderPosition == 0) {
            sliderButtonPrev.hide();
        } else {
            sliderButtonPrev.show();
        }
        if (sliderPosition == -sliderTrackWidth) {
            sliderButtonNext.hide();
        } else {
            sliderButtonNext.show();
        }
    };
    sliderButtons();
}

$('.FilesContainer').mousedown( function (e) {
    console.log(e.currentTarget.clientWidth);
})