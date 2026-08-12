# Chapter4 Skynet的进阶技法
### 如何关闭服务器
```
流程 
    1.gateway 阻止新玩家连接
    2.缓慢让所有玩家下线
        note: 如果同时让玩家同时下线 数据库服务会压力很大
        可以分批次每次提到指定数量的玩家
    3.保存玩家数据 和 各个系统数据
    4.关闭相关节点

```
### 断线重连
```

client  -> gateway -> [agent scene]


gateway={
    key:string;断线重连验证
    lost_conn_time:nummber;记录最后一次断开连接的时间
    msgcache:Array<msg>;agent 未发送的出去的消息
}


login success  ---------------> key (note:这个key专门用于断线重连)




client-->gateway 断线

client->connect gateway
client->reconnect key .... gateway;
    客户端断线重连协议 发送到gateway
gateway reconnect client 成功

gateway 会将 缓存的消息发送到客户端







note:
    1.消息缓存我们一定要设置一定的限度 例如 如果消息大于500条 不允许重新连接
    2.客户端只是与gateway 断开了连接 agent 和 scene 里面的逻辑在继续的跑没有受印象仍然在继续跑逻辑



服务器断线处理
1.gateway 监听到了客户端断线 不会立即触发客户端掉线的处理 只处理与客户端连接对象的联系  player.conn =null

2.设置定时器  5分钟 ,时间到了并且player.conn == null 则向agentmgr 请求agent 下线


```