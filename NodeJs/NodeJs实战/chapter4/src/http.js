const http = require("http");

const server = http.createServer(function (req, res) {
    // 每一条Http 从浏览器请求都要触发该函数
    //res.end() 结束响应
    // 如果客户端没有执行响应结束 该请求会被挂起or 知道客户端timeout 或者它一直被打开

    // res.write("hello word");
    // res.end();

    // 操作响应头的函数
    // res.setHeader
    // res.getHeader
    // res.removeHeader
    // res.end("hello word");

    // const body = "hello word";
    // // 响应内容的长度
    // res.setHeader("Content-Length", body.length)
    // // 告诉浏览器是文字类型
    // res.setHeader("Content-Type", "text/plain");
    // // note: 设置响应头必须在 write or end 之前  当write 之后响应头已经设置好了

    // res.end(body)



    // res.statusCode=404;
    // // note:响应码设置必须在 write or end 之前  当write 之后响应头已经设置好了

    // res.end();


    // const url = "https://www.google.com/";
    // const body = `<p>Redirecting to <a herf ='${url}'></p>`
    // res.setHeader("Location", url);
    // // 数据长度
    // res.setHeader("Content-Length", body.length);
    // // 响应数据类型
    // res.setHeader("Content-Type", "text/html");
    // res.statusCode = 302;
    // res.end(body)
})


// 端口
server.listen("8080")

