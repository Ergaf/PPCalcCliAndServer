const http = require("http")
const fs = require("fs")
const path = require("path")
const utf8 = require('utf8');
const port = 5555

//server main ----------------------------------------------------------
http.createServer((req, res) => {
    if(req.url === "/"){
        sendRes("index.html", "text/html", res)
    }
    else if(req.url === "/upload" && req.method === "POST"){
        // saveFile(res, req)
        test(req, res)
    }
    else if(req.method === "GET"){
        sendRes(req.url, getContentType(req.url), res)
    }

}).listen(port, () => {
    console.log("server start "+port);
})
//-------------------------------------------------------------------------

//send res-----------------------------------------------------------------
// function sendRes(url, contentType, res) {
//     let file = path.join(__dirname+"/static/", url)
//     fs.readFile(file, (err, content) => {
//         if(err){
//             res.writeHead(404)
//             res.write("file not found")
//             res.end();
//             console.log("file not found "+file);
//         }
//         else {
//             res.writeHead(200, {"Content-Type": contentType})
//             res.write(content)
//             res.end();
//             console.log("sucess! "+file);
//         }
//     })
// }

//content type-------------------------------------------------------------
function getContentType(url) {
    switch (path.extname(url)){
        case ".html":
            return "text/html"
        case ".css":
            return "text/css"
        case ".js":
            return "text/javascript"
        case ".json":
            return "application/json"
        default:
            return "application/octate-stream"
    }
}
//save file----------------------------------------------------------------
function saveFile(data){
    // let writeableStream = fs.createWriteStream("hello.txt")
    // writeableStream.write(res.body);
    // writeableStream.end()

    fs.writeFile("hello.jpg", data, function(error){
        if(error) {
            throw error;
        }

        console.log("Асинхронная запись файла завершена. Содержимое файла:");
    });
}


function test(req, res) {
    let data = "";
    req.on("data", chunk => {
        data += chunk;
    });
    req.on("end", () => {
        saveFile(data)
        res.write("1")
        res.end();
    });
}

async function test2(req, res) {
    const buffers = []; // буфер для получаемых данных

    for await (const chunk of req) {
        buffers.push(chunk);        // добавляем в буфер все полученные данные
    }
    const user = JSON.parse(Buffer.concat(buffers).toString());
    console.log(user);
    res.end("Данные успешно получены");
}