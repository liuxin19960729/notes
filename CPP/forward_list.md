# forward_list
```cpp
底层数据结构单链表  插入和删除效率非常高

note:该链表是单向的

```

### std::before_begin
```cpp
#include <iostream>
#include <forward_list>

int main ()
{
  std::forward_list<int> mylist = {20, 30, 40, 50};

  //  mylist.before_begin() 容器第一个元素之前的位置
  mylist.insert_after ( mylist.before_begin(), 11 );

  std::cout << "mylist contains:";
  for ( int& x: mylist ) std::cout << ' ' << x;
  std::cout << '\n';

  return 0;
}
```