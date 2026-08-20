
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