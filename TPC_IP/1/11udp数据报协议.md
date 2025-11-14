# 11 udp 数据报协议
## 11.1 引言
```
UDP 伪装成一个IP 数据报的格式

IP 首部(20字节) UDP 首部(8字节) UDP 数据

应用程序必须关心数据报的长度
  note: 超过MTU 长度IP 数据报会进行数据分片
  (即使发送端部进行分片中间的路由器等网络设备也可能造成IP 数据的分片)

```
## 11.2 UDP 首部
```
2 byte scr port  2 byte dst port
2 byte udp 长度   2 byte udp cheksum
数据
note: udp 有cheksum 保证了中奖不会被篡改

TCP 和 UDP 端口是独立的


udp 长度 udp 首部 + udp 数据字节长度
  udp 最小长度为 0 8字节首部+0字节数据
```
## 11.3 数据报检验和
```
UDP 检验checksum 不正确会偷偷的把数据丢弃掉
```
## 11.5 IP 分片
```

```