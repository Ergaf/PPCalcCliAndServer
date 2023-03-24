const path = require("path");
module.exports = {
    getContentType: function getContentType(url) {
    switch (path.extname(url)) {
        case ".html":
            return "text/html"
        case ".css":
            return "text/css"
        case ".js":
            return "text/javascript"
        case ".json":
            return "application/json"
        case ".jpeg":
            return "image/jpeg"
        case ".png":
            return "image/png"
        default:
            return "application/octate-stream"
    }
}
}