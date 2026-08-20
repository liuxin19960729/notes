
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