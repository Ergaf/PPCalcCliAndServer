const fs = require("fs");
const path = require("path");
module.exports = {
    sendRes: function sendRes(url, contentType, res) {
    let file = path.join(__dirname + url)
    fs.readFile(file, (err, content) => {
        if (err) {
            res.writeHead(404)
            res.write("file not found")
            res.end();
            console.log("file not found " + file);
        } else {
            res.writeHead(200, {"Content-Type": contentType})
            res.write(content)
            res.end();
            console.log("sucess! " + file);
        }
    })},
    filesDelete: function filesDelete(y) {
    let y1 = fs.readdirSync(y);
    for (let x of y1) {
        let stat = fs.statSync(y + x); // тут забыли путь
        if (!stat.isFile()) {
            let path = y + x + '/';
            filesDelete(path);
        } else {
            fs.unlinkSync(y + x)
        }
    }
},
    getFilesForAdminView: function getFilesForAdminView(req, res, url) {
    try {
        let stats = fs.statSync(__dirname + `/${url}`)
        if (stats.isDirectory()) {
            let readdir = fs.readdirSync(__dirname + `/${url}`)
            let readdirInfo = []
            for (let i = 0; i < readdir.length; i++) {
                let path = __dirname + `/${url}/${readdir[i]}`
                let stats = getStatsInFile(path);
                let reddirUnit = {
                    name: readdir[i],
                    size: stats.size,
                    birthtime: stats.birthtime,
                    error: stats.error,
                    isFile: stats.isFile
                }
                readdirInfo.push(reddirUnit)
            }
            res.send(readdirInfo)
        } else if (stats.isFile()) {
            let readdirInfo = []
            let reddirUnit = {
                isFileOpen: true,
                name: "file",
                size: stats.size,
                birthtime: stats.birthtime,
                error: false,
                url: `/${url}`
            }
            readdirInfo.push(reddirUnit)
            res.send(readdirInfo)
        }
    } catch (e) {
        console.log(e.message);
        let readdirInfo = []
        let reddirUnit = {
            error: e.toString()
        }
        readdirInfo.push(reddirUnit)
        res.send(readdirInfo)
    }
}
}
function getStatsInFile(path) {
    try {
        const stats = fs.statSync(path)
        let statsToReturn = {
            birthtime: stats.birthtime,
            size: stats.size,
            error: false,
            isFile: stats.isFile()
        }
        return statsToReturn
    } catch (e) {
        let statsToReturn = {
            birthtime: "no",
            size: "no",
            error: e.toString(),
        }
        return statsToReturn
    }
}