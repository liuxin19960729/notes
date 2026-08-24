# utility
### std::swap
```cpp
// swap algorithm example (C++11)
#include <iostream> // std::cout
#include <utility>  // std::swap

int main()
{
    // swap(&a,&b) tmp =b,b=a;a=b;
    int x = 100, y = 200;
    std::swap(x, y);

    std::cout << x << std::endl;
    std::cout << y << std::endl;


    // 
    int foo[4]={} ;              // foo: ?  ?  ?  ?
    int bar[] = {10, 20, 30, 40}; // foo: ?  ?  ?  ?    bar: 10 20 30 40
    
    // 两个数组大小必须一样大
    std::swap(foo, bar);          // foo: 10 2

    std::cout << "foo contains:";
    for (int i : foo)
        std::cout << ' ' << i;
    std::cout << '\n';
}
```
### std::swap_ranges
```cpp
区间交换


teample:

template<class ForwardIterator1, class ForwardIterator2>
  ForwardIterator2 swap_ranges (ForwardIterator1 first1, ForwardIterator1 last1,
                                ForwardIterator2 first2)
{
  // 在范围内的每个元素都要进行交换
  while (first1!=last1) {
    swap (*first1, *first2);
    ++first1; ++first2;
  }
  return first2;
}




例子

#include <iostream>     // std::cout
#include <algorithm>    // std::swap_ranges
#include <vector>       // std::vector

int main () {
  std::vector<int> foo (5,10);        // foo: 10 10 10 10 10
  std::vector<int> bar (5,33);        // bar: 33 33 33 33 33


  // 2-4 10 33 33 33 10
  //10 10 10 33 33
  std::swap_ranges(foo.begin()+1, foo.end()-1, bar.begin());

  // print out results of swap:
  std::cout << "foo contains:";
  for (std::vector<int>::iterator it=foo.begin(); it!=foo.end(); ++it)
    std::cout << ' ' << *it;
  std::cout << '\n';

  std::cout << "bar contains:";
  for (std::vector<int>::iterator it=bar.begin(); it!=bar.end(); ++it)
    std::cout << ' ' << *it;
  std::cout << '\n';

  return 0;
}

```

### std::iter_swap
```cpp
两个迭代器所指向的对象交换值

template <class ForwardIterator1, class ForwardIterator2>
  void iter_swap (ForwardIterator1 a, ForwardIterator2 b)
{
  swap (*a, *b);// 指针所对应对象值交换
}



#include <iostream>     // std::cout
#include <algorithm>    // std::iter_swap
#include <vector>       // std::vector

int main () {

  int myints[]={10,20,30,40,50 };              //   myints:  10  20  30  40  50
  std::vector<int> myvector (4,99);            // myvector:  99  99  99  99

  std::iter_swap(myints,myvector.begin());     //   myints: [99] 20  30  40  50
                                               // myvector: [10] 99  99  99

  std::iter_swap(myints+3,myvector.begin()+2); //   myints:  99  20  30 [99] 50
                                               // myvector:  10  99 [40] 99

  std::cout << "myvector contains:";
  for (std::vector<int>::iterator it=myvector.begin(); it!=myvector.end(); ++it)
    std::cout << ' ' << *it;
  std::cout << '\n';

  return 0;
}



```

### std::replace  
```cpp

template <class ForwardIterator, class T>
  void replace (ForwardIterator first, ForwardIterator last,
                const T& old_value, const T& new_value)
{
  while (first!=last) {
    if (*first == old_value) *first=new_value;
    ++first;
  }
}




#include <iostream>     // std::cout
#include <algorithm>    // std::replace
#include <vector>       // std::vector

int main () {
  int myints[] = { 10, 20, 30, 30, 20, 10, 10, 20 };
  std::vector<int> myvector (myints, myints+8);            // 10 20 30 30 20 10 10 20


// myvector.begin() -myvector.end  将20 替换为 99
  std::replace (myvector.begin(), myvector.end(), 20, 99); // 10 99 30 30 99 10 10 99

  std::cout << "myvector contains:";
  for (std::vector<int>::iterator it=myvector.begin(); it!=myvector.end(); ++it)
    std::cout << ' ' << *it;
  std::cout << '\n';

  return 0;
}


```