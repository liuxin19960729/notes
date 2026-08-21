# operator 

## operator 目标类型（）{}
```cpp

作用：定义类对象如何隐式或显式地转换为其他类型

operator bool() const { return val != 0; }  // 对象可转为 bool
operator int() const { return val; }        // 对象可转为 int

```


## 一元操作函数（单目运算符）
```
operator@()
```

## 二元操作函数（双目运算符）
```cpp
operator@(const T& other)


// 例如  
Vec2 operator+(const Vec2& other) const { return {x+other.x, y+other.y}; }
bool operator==(const Vec2& other) const { return x==other.x && y==other.y; }
```


## 函数调用与下标操作函数（特殊访问）、

```cpp

operator()（函数调用符）
struct Adder {
    int operator()(int a, int b) const { return a + b; }
};
Adder add; int sum = add(3, 4); // sum = 7


operator[]（下标操作符）


class Array { int data[10]; public:
    int& operator[](size_t i) { return data[i]; }
};

```

## 内存管理与指针操作函数（底层/智能指针）
```cpp




int* operator->() { return ptr; }
int& operator*() { return *ptr; }


```