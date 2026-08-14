# Chapter 4 TCP粘包和拆包问题解决之道

### 出现拆包和粘包发生的原因
```
1.写入的数据大小大于缓冲区大小(只有缓冲区有空闲的位置才能继续发送剩下的数据)
2.MSS(Maximum Segment Size 表示每条TCP 最多能发送最大的数据)大小的TCP分段
       通常 MSS<=MTU-40 (IPV4) OR MTU-60(IPV6)  
       SO_SNDBUF 可以设置发送缓冲区的大小

3.大于MTU进行IP分片

    MTU 以太网层 一般 1500

    如果IP 层的数据大于MTU 会分片发送



```

### 解决粘包问题
```
协议设计 header + content

header 包含消息总长度字段


```