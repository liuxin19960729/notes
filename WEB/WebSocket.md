# WebSocket
```
const webSocket = new WebSocket(url, protocols);
创建websocket对象后会自动的尝试建立与服务器的连接
```
## 编写WebSocket服务器
```
WebSocket 握手
客户端发送 握手请求

GET /chat HTTP/1.1
Host: example.com:8000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

note:
HTTP 版本必须是 1.1 或更高，方法必须是GET


服务器 接收到客户端发送到消息
如果服务器有任何不理解和不正确请求头数据, 则服务器应该发送“400 Bad Request”并立即关闭套接字。

它也可能会给出 HTTP 响应正文中握手失败的原因，但可能永远不会显示消息（浏览器不显示它）




note: 浏览器会请求链接的时候会发送  origin
    我们可以将这个请求头作为安全方面考虑,检查是否是同一个域，白名单/ 黑名单等）
    如果你不喜欢这个请求发起源，你可以发送一个403 Forbidden。需要注意的是非浏览器只能发送一个模拟的 Origin。大多数应用会拒绝不含这个请求头的请求.


服务器握手响应

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=


Sec-WebSocket-Accept:
    let value    客户端发送的 Sec-WebSocket-Key 和   "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"  连接起来
    Sec-WebSocket-Accept=base64(sha1(vale))


客户端收到服务器 Sec-WebSocket-Accept: 验证成功表示握手成功


note: 浏览器不能发送ping 消息  只能模拟发送ping 消息

关闭链接

```