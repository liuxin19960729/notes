const http = require("http");
const url = require("url")

const items = []
const server = http.createServer(function (req, res) {

    // // data 默认是buffer 设置编码 data 修改时utf8 字符串
    // req.setEncoding("utf-8");

    // req.on("data", function (chunck) {// 读入数据块 触发data 事件
    //     console.log("parsed", chunck);
    // })

    // req.on("end", function () {// 数据全部读取完了才会触发
    //     console.log("done parsing");
    //     res.end();
    // })


    switch (req.method) {
        case "POST": {
            let item = "";
            req.setEncoding("utf-8");
            req.on("data", function (chunck) {
                item += chunck;
            })

            req.on("end", function () {
                items.push(item)
                res.end("OK\n")
            })
            break;
        }
        case "GET": {
            const body = items.map((v, i) => `${i}) ${v}`).join("\n");
            res.setHeader("Content-Length", Buffer.byteLength(body))
            res.setHeader("Content-Type", "text/plain; charset='utf-8'")
            res.end(body);
            break;
        }

        case "DELETE": {
            const path = url.parse(req.url).pathname;
            const num = parseInt(path.split(1), 10);
            if (isNaN(num)) {
                res.statusCode = 400;
                res.end("Invalid item id")
            } else if (!items[num]) {
                res.statusCode = 404;
                res.end("Item not found");
            } else {
                items.slice(num, 1);
                res.end("OK\n")
            }
            break;
        }
    }


})

server.listen("8080")