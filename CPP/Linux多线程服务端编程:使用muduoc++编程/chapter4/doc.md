# chapter4
```
11个最基本的pthreads函数

    1.线程创建等待(join)  (2)
    2.mutex 创建 销毁 加锁 解锁  (4)
    3.条件  创建 销毁 等待 通知 广播 (5)



c/c++ (c98 c99 c++03) 并没有涉及线程
c/c++ (c11 c++11) c++11 定义了 std::thread



pthread_t  t;
    prhread_create(&t,NULL,fun,NULL)

    t 返回的对应值 不能作为线程的id因为线程t 的值表示的内存的值 并且内存的值是可以重复使用的
    

    gettid() 返回的线程的id 
    linux 分配线程id 采用递增轮序的方式返回短时间启动多个线程 也会具有不同的线程id



    gettid() 每次调用都会调用一次系统 消耗性能 可以在 线程被创建的时候 调用一次 gettid() 获取对应的值在缓存上


    
pthread_atfork(void (*prepare)(void),void (*parent)(void),void (*child)(void))


prepare fork 调用之前 
parent  fork 结束 父进程 
child  fork 解释 字进程





一个进程能创建多少个线程受内存大小和系统参数影响
一台机器可以并行运行的线程数目受CPU数目影响

 ```