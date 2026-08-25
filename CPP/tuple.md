# tuple
```cpp
元祖可以存储多个元祖对象,每个独享都可以是不同的类型

template <class... Types> class tuple;


元祖的构造函数
#include <iostream>
#include <utility>
#include <tuple>

int main()
{
    std::tuple<int, char> first;                           // default [0,0]
    std::tuple<int, char> second(first);                   // copy  [0,0]
    std::tuple<int, char> third(std::make_tuple(20, 'b')); // move  [20,'b']
    std::tuple<long, char> fourth(third);                  // implicit conversion
    std::tuple<int, char> fifth(10, 'a');                  // initialization [19,'a']
    std::tuple<int, char> sixth(std::make_pair(30, 'c'));  // from pair / move  [30,'c']

    std::cout << "sixth contains: " << std::get<0>(sixth);
    std::cout << " and " << std::get<1>(sixth) << '\n';
}

note: 如果元素构造里面的子元素没有构造产生异常那么保证元素的构造是无异常的


```

### std::tuple::swap
```cpp

void swap (tuple& tpl) noexcept( /* see below */ );

两个tuple 必须是同种类型


#include <iostream>
#include <utility>
#include <tuple>

int main()
{

    std::tuple<int, char> a(10, 'x');
    std::tuple<int, char> b(20, 'y');

    a.swap(b);

    std::cout << "a contains: " << std::get<0>(a);
    std::cout << " and " << std::get<1>(a) << '\n';

    return 0;
}



```
