# Net
## TCP流(net模块)
```js
TCP 长连接只要不发生错误or调用end()流就一直打开


data: 收到对方发送到数据
end:收到对方发送的FIN,表示对方不会继续发送数据,但是对方可能还在接收数据
close:socket 完全断开
error:网络异常
drain:缓冲区已经空了可以继续发送数据



note:
    allowHalfOpen :true 才可以半连接


```

## net.createServer([options][, connectionListener])
```js
创建一个TCP服务器

optiions:
    配置服务器选项
    1.allowHalfOpen 默认 false
        false 客户端发送FIN 会回发一个 FIN 关闭连接 
        true 客户端发送FIN 触发end 事件 告诉服务我不会在发送数据了
           note: 这里只是告诉客户端不发送  但是客户可以接收数据 服务器仍然可以向服务器写入数据
           直到服务器显示的调用end() 向客户端发送FIN
    
    2.pauseOnConnect 默认false
        2.1false (默认) : 连接建立后，Socket 会立即开始接收数据（触发 data 事件）。
        2.2true : 连接建立后，Socket 默认为 暂停状态 （paused）。
        
        适用场景 : 通常用于**集群（Cluster）**或多进程架构。主进程接收连接，但暂时不读取数据，直接把这个 Socket 句柄（handle）传递给子进程，由子进程去 resume() 并处理数据。这样可以避免数据在主进程被读出来，导致子进程读不到。

connectionListener:
    新客户端连接触发回调
    
    也可以通过监听 connection 事件


```
## server.listen()
```js
启用服务器监听指定端口
```
## net.createConnection(options[, connectListener])
```js

```

