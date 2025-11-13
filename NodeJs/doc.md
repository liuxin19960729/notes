## 协议设计
```
  request消息格式定义：
   {
		id: 消息id，标志请求和响应的对应关系。Notify不需要这个字段；
		moduleId: 消息的路由字段，指明处理该消息由哪个模块处理；
		body: 消息内容，处理消息所需的key/value数据
   }

 notify消息格式定义：
   {
		moduleId: 消息的路由字段，指明处理该消息由哪个模块处理；
		body: 消息内容，处理消息所需的key/value数据
   }


```