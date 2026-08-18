// client.js
const net = require('net');

const PORT = 3000;
const HOST = '127.0.0.1';




// 创建客户端连接
const client = net.createConnection({ port: PORT, host: HOST }, () => {
  console.log('已连接到服务器');


  // 发送一条消息
  const message = 'Hello, TCP Server!';
  client.write(message);
  console.log(`发送消息: ${message}`);
});

// 接收服务器数据
client.on('data', (data) => {
  console.log(`收到服务器响应: ${data.toString().trim()}`);
  // 收到响应后关闭连接
  client.end();// 发送  FIN  数据包
});

// 连接关闭
client.on('end', () => {
  console.log('与服务器的连接已关闭');
});

// 错误处理
client.on('error', (err) => {
  console.error(`客户端错误: ${err.message}`);
});