# Array
```cpp

type name [elements];

该数组大小在编译的时候就确定了

```

### 初始化数组
```cpp

int foo [5] = { 16, 2, 77, 40, 12071 }


int bar [5] = { 10, 20, 30 };
    前三个被初始化为 10,20,30 后面两个使用0填充


int baz [5] = { };
    数组全部被0填充




int foo [] = { 16, 2, 77, 40, 12071 };
    cpp 允许 [] 不写具体的数字  会在编译的时候自动分配一个大小



定义在命名空间中 的数组 总是被初始化(不是定义在函数)

```

### 多维数组
```
多维数组  编译器会记录每个维度的深度




```
### array function 
```cpp
#include <iostream> // std::cout
#include <array>    // std::iter_swap
#include <utility>

int main()
{
    std::array<int, 20> arr{1, 2, 3, 4, 5, 6, 7};
    std::size_t size = arr.end() - arr.begin();
    std::cout << size << std::endl;

    //Iterators
    for (auto rit = arr.rbegin(); rit < arr.rend(); rit++)
    {
        std::cout << *rit << std::endl;
    }

    for (auto it = arr.begin(); it < arr.end(); it++)
    {
        std::cout << *it << std::endl;
    }



    // cbegin cend crbegin crend 返回的是 const type 



    // Capacity 容量
    // 元素个数
    std::cout << arr.size() << std::endl;
    // 总共占用内存大小
    std::cout << sizeof(arr) << std::endl;

    // 数组容器能容纳最大元素个数 note: max_size 和  size 一样总是等于模版第二个参数
    std::cout << arr.max_size() << std::endl;

    std::cout << arr.empty() << std::endl;

    // lement access 元素访问

    // 第一个元素值
    std::cout << "front:" << arr.front() << std::endl;
    // 最后一个元素值
    std::cout << "back:" << arr.back() << std::endl;



    // 返回 std::array 里面 数组的指针
    int * _p= arr.data();

    _p[1]=200;
}
```