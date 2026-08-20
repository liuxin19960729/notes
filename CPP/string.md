# string
```cpp


std::string s1;

std::string s2 = "Hello"; // 拷贝初始化
    1.先将 "Hello" 转换成一个临时的 string
    2.将临时的string 拷贝构造
    string(const char*)
std::string s3("World");// 直接初始化
    string(const char*)

std::string s4(5, 'A'); // "AAAAA" (5个A)
std::string s5 = s2 + " " + s3;     // "Hello World" (重载了 +)




// 字符串容量
size()
length()
empty()


capacity() 
reserve(size) 预分频内存

// 字符穿修改

push_back（char）// 末尾添加一个字符
append(string) // 末尾添加字符串
+=



insert(0, "Hi, ")// 在位置0插入
erase(0, 4)//从0的位置删除4个字符
replace(0, 5, "Hey")// 从 0开始 5个字符替换  "Hey"


clear() ;// 清空为 "" 字符串


str[0];          // 不检查边界（快，但越界是未定义行为）
str.at(0);       // 检查边界（越界抛 std::out_of_range 异常）
str.back();  // 最后一个字符
str.front();// 第一个字符



std::string::npos 和 find 配合使用  如果没有找到使用 std::string::npos 判断


substr(pos, 8) // 截取子字符串


find() // 寻找字符字符串


std::to_string() //转换为字符串




const char* raw_data = send_buf.c_str()

 c++ 17
char* raw_data  send_buf.data() 可以修改

// string.h  除了 \0 字符字符串长度  char * 
strlen(buffer)


// 字符串转换为 num int .....
int num = std::stoi("123");
long long big = std::stoll("999999");





```