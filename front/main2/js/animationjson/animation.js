let animationDigital = document.querySelector('#animationDigital')
let animationWide = document.querySelector('#animationWide')

var animation = bodymovin.loadAnimation({
    container: animationWide,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '../files/data/animationWide.json' // путь к вашему JSON-файлу
});