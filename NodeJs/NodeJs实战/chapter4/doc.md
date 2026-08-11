# Chapter4 构建Node Web程序

###  HTTP 服务器的基础知识
```js

302 重定向到 url地址
res.setHeader("Location", url);
res.statusCode = 302;
```
### 构建RESTful Web服务
```js

字节长度
Buffer.byteLength(body)

note: Content-Length byte 长度
res.setHeader("Content-Length", Buffer.byteLength(body))


```
### 提供静态文件服务
```js
pipe

//将读流通过管道写入到写流
readableStream.pipe(writableStream)

note: pipe 会自动调用 stream.end();

// 流的错误处理机制
stream.on("error",function (err){

})


 fs.stat(_path, function (err, stat){
    err.code === "ENOENT" 404
 })
```