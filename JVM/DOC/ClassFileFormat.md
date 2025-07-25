# ClassFileFormat
## 类文件结构
```
1.u4 magic
    魔数，固定为0xCAFEBABE
2.u2 minor_version
    次版本号
3.u2 major_version
    主版本号
4.u2 constant_pool_count;
    note: 索引1开始
    0x0026 表示存在37项常量

5.常量数据



```
### 版本好说明
```

```
### 常量池
```
字面量:
    声明final的常量值
    文本字符串

符号引用:
    倍模块导出和开放的包
    类接口全限定路径
    字段名称和描述符
    方法名称描述符
    方法句柄和方法类型
    动态调用点和动态常量


常量的数据结构
u1 tag;
note: 每一个常量的数据都不一样但是每一个常量开头都是 u1 tag


```