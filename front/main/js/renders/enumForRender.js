function getUkrType(type){
    switch (type) {
        case "digital":
            return "Цифровий друк"
        case "wide":
            return "Широкоформатний друк"
        case "photo":
            return "Фото друк"
        case "one":
            return "з 1-ї сторони"
        case "two":
            return "з 2 сторін"
        case "bw":
            return "Чорно-білий"
        case "color":
            return "Кольоровий"
        default:
            return "null"
    }
}