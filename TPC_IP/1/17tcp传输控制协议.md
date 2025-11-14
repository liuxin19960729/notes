# 17 TCP传输控制协议
## 17.1 引言
## 17.2 TCP 的服务
```
TCP 面向连接,可靠的字节流服务

1.TCP 可能会将太长的数据拆分成合适大小的块(UDP 不同)

2.TCP 发送数据启动一个定时器用于确认重试等机制操作

3.TCP 接收端接收到数据不会立即发送确认而是会推迟几分之一秒

4.接收到数据TCP 会保持首部和数据的校验(防止在传输过程中数据和首不发生什么变化) 如果验证不通过则立即丢弃
 (希望发送端超时重新传输数据 在此验证)

5.TCP 必须保存顺序接收

6.TCP 不能保证数据重复

7.TCP 提供了流量控制
    TCP 接收数据是有大小限制的 如果 数据接收数据超过缓冲去数据大小会丢弃数据(数据处理的速度小于发送到速度)
```
## 17.3 TCP 的首部
```
IP首部+(TCP首部+TCP数据)

TCP首部(20bytes)
2byte:src port  2byte:dst port
4byte:seq num
4byte:ack seq num
4 bits 首部长度(最大F) 6bits 保留 URG ACK PSH RST FYN FIN 2byte 窗口大小
2 byte check sum 2byte 紧急指针 
选项字段 .....


src port dst port 用于寻找发端和收端应用程序
seq num 序号(4byte [0,0XFFFFFFFF])
    接收端更具序号排序数据避免乱序交给上层的应用
ack seq num

三次握手
客户端 → 服务器 : SYN, Seq = 100
服务器 → 客户端 : SYN+ACK, Seq = 500, Ack = 101
客户端 → 服务器 : ACK, Seq = 101, Ack = 501

ack seq num 规则 是 发送端  seq +1
seq 表示对是当前发送自己的序列号

接收端已经获取到了
1.[1,1024] 返回 ack seq 1025
2.[2049,3027] 接收端值接收到了 [1,1024] 并不能确认 [2049,3027] 所以只能你返回 ack seq 1025
3.[1025,2048] 数据接收到了 checksum 验证错误数据丢弃 只能返回 ack seq 1025

4 bits 首部长度(最大F)
 unit=4byte(32bits)
 最大:15*unit=60
 最小TCP 长度5*4=20

 TCP 头部长度[20,60]

5. 6 bits 保留

6. 6bits 
URG 紧急指针
ACK 确认序列好
PSH 接收方尽快将报文段交给应用层
RST 重新建立连接
SYN 同步序号用来发起一个连接
FIN 发端完成发送任务
7.窗口大小

例如
    C-S
    seq num 342473578
    ack seq num 0

    B
    1000 4*8=32 byte   000000 保留    000010 SYN   
    32 byte TCP 头部长度
    FF FF (2byte)当前窗口 大小 65535 byte

8. 2 byte checksum
9. 2 byte 是否是紧急指针
    note: URG 标志位设置未1
    这个紧急指针才有效
.... TCP data

放在TCP 首部里面
最长见的TCP可选字段
MSS(Maximum Segement Size) 最长报文大小

```