# chapter1
```
两阶段编译检查
1.模版定义阶段
    1.检查语法
    2.检查不依赖模版未定义的函数.....

2.模版实例化阶段
    模版会检查和模版依赖相关的类型参数.....

实例化模版 模版需要看到模版的完整定义


```

## 1.2 模版参数推断
```
类型推断中的类型转换
1.如果调用参数是引用传递的,那么任何转换都是不被允许的
2.如果是按值传递 那么只有退化(decay)这一列简单转换是被允许的 const 和 volatile 限制符会忽略
    引用被换行为被引用类型
    raw array 和函数被转换为相应的指针类型


teample <typename T>
T max(T a, T b);

int const c=42
max(c,c);// T被推断成int
int  i=1;
max(i,c);// T 被推断未 int ,c 中的const 被decay 掉


int & ir =i;
max(i,ir); T被推断为 int ir 中的引用被decay 掉

int arr[4];

max(&i,arr); T被推断为 int  *




//显示的指出 T 的类型为double
max<double>(1.2,2.2)

```

## 1.3 多个模版参数
```
teample <typename T1,typename T2>
T1 max(T1 a,T2 b){

}

auto m =::max(4,7.2); //返回的第一个模版参数T1的类型

max(66.66,42) 返回的是double 类型
max(42,66.66) 返回的是 66




```