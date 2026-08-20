# memory
```cpp

// 全局函数 分配 n*sizeof(T)内存
static_cast<T*>(::operator new(n * sizeof(T)))
::operator delete(p)




// 会调用构造和析构函数
new delete

会调用多次构造和析构函数
new [] delete[]

```