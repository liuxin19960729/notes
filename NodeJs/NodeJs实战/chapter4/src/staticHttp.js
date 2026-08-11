const http = require("http");
const url = require("url")
const path = require("path")
const fs = require("fs");
// __dirname 内置变量 它的值是当前文件所在目录的路径
const root = __dirname
// 静态服务器
const server = http.createServer(function (req, res) {
    const _url = url.parse(req.url)
    const _path = path.join(root, _url.pathname)
    // fs.exists(_path, (exits) => {
    //     if (!exits) {
    //         res.statusCode = 404;
    //         return res.end();

    //     }
    //     const stream = fs.createReadStream(_path);
    //     stream.on("data", function (chunck) {
    //         res.write(chunck);
    //     })
    //     stream.on("end", function () {
    //         res.end();// 文件结束后结束响应
    //     })
    // })

    // 预先判断文件的状态
    fs.stat(_path, function (err, stat) {
        if (err) {
            if (err.code == "ENOENT") {// 文件不存在
                res.statusCode = 404;
                res.end("Not Found")
            } else {
                res.statusCode = 500;
                res.end("Internal Server Error");
            }

        } else {
            const stream = fs.createReadStream(_path);
            stream.pipe(res) // note:res.end(会在pipe 内部调用)
            // 错误处理机制
            stream.on("error", function (err) {
                res.statusCode = 500;
                res.end("Internal Server Error");
            })
        }
    })


})
server.listen("8080")