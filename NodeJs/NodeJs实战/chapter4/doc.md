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
### 从表单中接受用户输入
```

处理提交的表单域

Content-Type 

application/x-www.-form-urlencoded :HTML 表单的默认值
multipart/form-data  表单中含有文件或非ASCII或二进制数据时使用





文件表单上传

1.判单  Content-Type 是否 multipart/form-data

2.formidable 库来解析

```

### 用HTTTPS 加强程序安全性
```js
HTTPS=HTTP+(TLS/SSL)

    私钥+证书
私钥:用来解析客户端发送给服务端的数据

证书: 公钥+证书持有者的信息

公钥用来加密客户端的数据

```