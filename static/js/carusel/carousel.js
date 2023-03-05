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
    let carousel = e.currentTarget
    let carouselWidth = e.currentTarget.clientWidth
    let carouselContainerWidth = $('.FilesContainerRelative')[0].clientWidth
    // console.log(carouselWidth);
    // console.log(carouselContainerWidth);
    // document.body.appendChild(carousel);
    // if(carouselWidth > carouselContainerWidth){
        var coords = getCoords(carousel);
        var shiftX = e.pageX - coords.left;
        var shiftY = e.pageY - coords.top;

        moveAt(e);
        function moveAt(e) {
            // console.log("left "+carousel.getBoundingClientRect().left);
            // console.log(`raznica ${-carouselWidth + carouselContainerWidth}`);
            carousel.style.left = e.pageX - shiftX + 'px';
            let homeBWidth = $('#homeB')[0].getBoundingClientRect().width
            // console.log(homeBWidth);

            if(carousel.getBoundingClientRect().left > 0){
                // console.log(1);
                carousel.style.left = 0 + 'px';
            }
            if(carousel.getBoundingClientRect().left < -carouselWidth + carouselContainerWidth){
                // console.log(2);
                console.log(carouselWidth - carouselContainerWidth);
                carousel.style.left = -carouselWidth + carouselContainerWidth + 'px';
            }
            if(0 <= -carouselWidth + carouselContainerWidth){
                // console.log(3);
                carousel.style.left = 0 + 'px';
            }
        }

        document.onmousemove = function(e) {
            moveAt(e);
        }
        document.onmouseup = function() {
            document.onmousemove = null;
            carousel.onmouseup = null;
        }

        carousel.ondragstart = function() {
            return false;
        };

        function getCoords(elem) {   // кроме IE8-
            var box = elem.getBoundingClientRect();
            return {
                top: box.top + pageYOffset,
                left: box.left + pageXOffset
            };
        }
    // }
})