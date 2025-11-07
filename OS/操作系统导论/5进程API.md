# 5进程API
## 5.1fork
```
pid= fork()

pid==0 表示 子进程执行
pid >0 父进程执行
   pid 表示的fork 之后 子进程的进程号



note:
   如果该电脑只有一个CPU,那么fork() 子进程被调度和父进程被调度都有可能被先调度

```

## 5.2 wait
```
父进程 调用wait() 等待子进程结束,wait() 才返回
```
## 5.3 exec调用
```
exec 调用 会覆盖当前自己代码端和数据段 并被重新初始化 
```
## 5.4 未什么这样设计API
```
shell 中 
   1.fork() 创建一个子进程
   2.exec() 子进程执行程序
   3.wait() shell 等待子进程执行完毕


shell命令
   wc p3.c > newfile.txt

shell 执行流程
1.fork()
2.关闭子进程关闭标准输出 打开 newfile.txt (此时标准输出的fd 就是 newfile.txt fd)
   close(STDOUT_FILENO)
   open("./newfile.txt")
3.exec(wc)
   wc 标准输出的值就被从定向到newfile.txt


UNIX 管道 | 也是使用类似的方式实现
   使用的是pipe()系统调用

原理
   父进程的输出链接到 pipe 
   子进程的输入链接到 pipe
``` 