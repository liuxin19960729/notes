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
