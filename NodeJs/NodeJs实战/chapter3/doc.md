# Chapter3 Node编程基础
```js
Node 回调惯例通常 function(err,data) {}


NodeJs 内置事件模块
const { EventEmitter } = require("events")
const emitter = new EventEmitter();




表示该函数期望参数数量
Function:length
    function func1() {} // 输出 0

    function func2(a, b) {}    // 输出2


```