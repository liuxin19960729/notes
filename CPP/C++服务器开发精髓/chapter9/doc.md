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