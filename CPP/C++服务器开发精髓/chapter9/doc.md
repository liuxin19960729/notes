# Chapter 9 服务器开发中的常用模块设计
## 9.1 断线自动重连的映红场景和逻辑设计
```js
客户的网络环境非常的复杂 如果一位的重连 2s  4 s 8s ........会发现间隔越来越大 如果后面某一个事件端网络恢复 由于时间间隔非常大会等待很久才会重新连接成功

正确做法 检查网络的状态 如果网络状态恢复正常 就立即进行重新连接



浏览器网络状态监听

navigator.onLine

网络状态监听
window.addEventListener('online',  () => { console.log('网络恢复'); });
window.addEventListener('offline', () => { console.log('网络断开'); });

andriod 网络状态监听
https://developer.android.com/develop/connectivity/network-ops/reading-network-state?hl=zh-cn

技术上的connect 重新连接成功没有任何意义 一般技术上重新连接成功 还需要业务上重新连接(密码和账号输入)

```

### 9.2.1 TCP Keepalive选项
```
Keekalive 默认 心跳间隔是 7200ms 时间间隔板太长即使开启它 也不具有使用性


如果发送 keepalive 消息 并且接收到 那么 该连接还活着等待 TCP_KEEPIDLE 间隔发送
TCP_KEEPIDLE

// 发送 keepalive 没有 响应 之间间隔多久时间发送第二次
TCP_KEEPINTVL

// keep alive 消息 发送 次数超过该设置次数返回timeout 
TCP_KEEPCNT 
```
### 9.2.2 应用层的心跳包机制设置
```
//  检测心跳包 当对端没有数据来往一段时间才做一次心跳检测


客户端向服务端发送 心跳数据 
服务端 回应心跳数据 并且 检查   心跳 如果超过一段时间没有数据接收 则主动断开回收连接

```

### 9.2.3 有代理的心跳包机制设计
```


client  -> prox server -> server
[     外网   ] [     内网   ]

服务器通过记录客户端 心跳和业务的上行数据时间 如果一段时间内没有上行数据 则 客户端可 proxy 断开


```
