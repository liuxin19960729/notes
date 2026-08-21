
## #include<utility>
### std::remove_reference
```cpp
template<typename _Tp>
constexpr typename std::remove_reference<_Tp>::type&& move(_Tp&& __t) noexcept {
    return static_cast<typename std::remove_reference<_Tp>::type&&>(__t);
}


// 去除 _Tp 的引用修饰符
std::remove_reference<_Tp>


    // 原理 编译器更具匹配模式 匹配上 不同 struct

    template<typename _Tp>
    struct remove_reference
    { using type = _Tp; };

  template<typename _Tp>
    struct remove_reference<_Tp&>
    { using type = _Tp; };

  template<typename _Tp>
    struct remove_reference<_Tp&&>
    { using type = _Tp; };


    
    c++11 之前 typedef T type
    c++ 这Hi好偶
    using type =T


// 编译器在解析的时候不知道这个具体类型 告诉编译器这个是个类型
typename ... ::type




```


### std::forward
```cpp

  template<typename _Tp>
    _GLIBCXX_NODISCARD
    constexpr _Tp&&
    forward(typename std::remove_reference<_Tp>::type& __t) noexcept
    { return static_cast<_Tp&&>(__t); }

  /**
   *  @brief  Forward an rvalue.
   *  @return The parameter cast to the specified type.
   *
   *  This function is used to implement "perfect forwarding".
   */
  template<typename _Tp>
    _GLIBCXX_NODISCARD
    constexpr _Tp&&
    forward(typename std::remove_reference<_Tp>::type&& __t) noexcept
    {
      static_assert(!std::is_lvalue_reference<_Tp>::value,
	  "std::forward must not be used to convert an rvalue to an lvalue");
      return static_cast<_Tp&&>(__t);
    }



引用折叠
_Tp&&&  ->  _Tp&
_Tp&&&& -> _Tp&&



```

### std::make_shared
```cpp
  template<typename _Tp, typename... _Args>
    inline shared_ptr<_NonArray<_Tp>>
    make_shared(_Args&&... __args)
    { 
      // 创一个分配器类型的独享 _a
      using _Alloc = allocator<void>;
      _Alloc __a;
      return shared_ptr<_Tp>(_Sp_alloc_shared_tag<_Alloc>{__a},
			     std::forward<_Args>(__args)...);
    }

模版函数对象

... _Args  构造函数所需要的参数


shared_ptr<_NonArray<_Tp>> 返回类型


_Args&&...，这是转发引用（万能引用），可以接受左值或右值，并保留其值类别。



  // 将分配器类型的执行存入到 _Sp_alloc_shared_tag 结构体里面
  template<typename _Alloc>
    struct _Sp_alloc_shared_tag
    {
      const _Alloc& _M_a;
    };


```

### shared_ptr
```cpp
// 直接传入T的指针
std::shared_ptr<T>(new T)


// 先定义为空指针 在通过reset 指定对应的指针
std::shared_ptr<T> p3;
p3.reset(new T(30)); /



// 可以定义惨初期 当要被销毁的时候 会将 执行传入到del_fun
std::shared_ptr<T>(point,del_fun)



#include <iostream>
#include <memory>
#include <utility>

class share
{
private:
    /* data */
public:
    share(/* args */);
    ~share();
};

share::share(/* args */)
{
    std::cout << "share" << std::endl;
}

share::~share()
{
    std::cout << "~share" << std::endl;
}

// 注意 自定义删除器 必须释放内存
void comp(share * p)
{
    std::cout << "comp:" << std::endl;
    delete p;
}

void test()
{
    std::shared_ptr<share> p_i(new share(), comp);
    std::cout << p_i.use_count() << std::endl;
}

int main()
{
    test();
}

```

### 转换类型
```c++
1.static_cast<目标类型>(待转换表达式)

note: 
  static_cast 用于良性的转换 用于编译的时候可确认的转换

1.
int、double、char 等数值类型间的显式转换，常用于消除编译器的精度丢失警告。


2.类层次结构中的向上转型（派生类 → 基类）

class Base {};
class Derived : public Base {};

Derived d;
Base* b = static_cast<Base*>(&d); // 安全




3.类层次结构中的向下转型（基类 → 派生类）


Base* b = new Derived(); // 基类指针指向派生类对象
Derived* d = static_cast<Derived*>(b); // 安全，因为 b 确实指向 Derived


4.将左值转换为右值引用

std::string str = "hello";
std::string&& rref = static_cast<std::string&&>(str); // 等价于 std::move(str)


5.枚举值（enum）与整数之间的转换

enum Color { Red, Green, Blue };
int num = static_cast<int>(Green); // 1
Color c = static_cast<Color>(2);   // Blue



6.void* 转换为具体类型指针


void* pVoid = malloc(100);
// c语言

char * pChar=<char *>pVoid;

// cpp
char * pChar=static_case<char *>pVoid;





// 运行的时候安全转型
2.dynamic_cast
  核心机制：依赖虚表（vtable）中的 RTTI（运行时类型信息）进行类型校验


转换指针失败 → 返回 nullptr（可判断）
转换引用失败 → 抛出 std::bad_cast 异常（无法返回空引用）



3.const_cast（常量性移除/添加）

int val = 10;
const int& ref = val; 
const_cast<int&>(ref) = 20; // 合法，因为 val 本身不是 const


note: 
如果 

const int val = 10;
const int& ref = val; 
const_cast<int&>(ref) = 20; // 可能会导致程序崩溃



3.reinterpret_cast   (底层位模式重解释)


int num = 0x12345678;
int* pInt = &num;
// 将 int* 转为 char*，用于逐字节查看内存
char* pChar = reinterpret_cast<char*>(pInt);



```


### _NonArray
```cpp


using _NonArray = __enable_if_t<!is_array<_Tp>::value, _Tp>;


//  _Cond 为 true 是  _Tp
using __enable_if_t = typename enable_if<_Cond, _Tp>::type;
   

    template<bool, typename _Tp = void>
    struct enable_if
    { };

  // Partial specialization for true.
  template<typename _Tp>
    struct enable_if<true, _Tp>
    { typedef _Tp type; };

  // __enable_if_t (std::enable_if_t for C++11)
  template<bool _Cond, typename _Tp = void>
    using __enable_if_t = typename enable_if<_Cond, _Tp>::type;




__enable_if_t<!is_array<_Tp>::value, _Tp>;
  当 !is_array<_Tp>::value 为true 类型为 _Tp



```

### integral_constant<bool, true>
```cpp

!is_array<_Tp>::value


template <typename T,T V>
struct share_ptr
{
    // constexpr 编译器完成
    static constexpr T value = V;
    using value_type = T;
    // 写了每个函数隐试转换函数
    constexpr operator value_type() const noexcept { return value; }


};

int main()
{
    share_ptr<int, 100> v;

    //  share_ptr 里面有隐试传递参数
    int g = v;

    std::cout << g << std::endl;
}

```

### std::function
```cpp


#include <iostream>
#include <memory>
#include <algorithm>
#include <functional>

// 自由函数
int add(int a, int b) { return a + b; }

struct func_cls
{
    int fac;
    func_cls(int f) : fac(f)
    {
    }

    int operator()(int x1, int x2)
    {
        return fac * x1 * x2;
    }
};

int main()
{
    std::function<int(int, int)> func = add;
    std::cout << func(3, 3) << std::endl;

    // lambda
    func = [](int a, int b)
    { return a * b; };

    std::cout << func(3, 3) << std::endl;

    func_cls fcls(100);

    func = fcls;

    std::cout << func(3, 3) << std::endl;

    func = [&fcls](int a, int b)
    { return fcls(a, b); };

    std::cout << func(3, 3) << std::endl;
}
```

### std::bind
```cpp
c++11 引入


#include <iostream>
#include <memory>
#include <algorithm>
#include <functional>

int add(int a, int b) { return a + b; }
int main()
{
    // std::placeholders::_1 std::bind 占位
    auto add10 = std::bind(add, 10, std::placeholders::_1);
    std::cout << add10(100) << std::endl;

    auto always_20 = std::bind(add, 10, 10);
    std::cout << always_20() << std::endl;
}
```