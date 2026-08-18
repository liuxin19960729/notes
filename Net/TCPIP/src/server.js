
// server.js
const net = require('net');

const PORT = 3000;
const HOST = '127.0.0.1';

// 创建 TCP 服务器
const server = net.createServer((socket) => {
  console.log(`客户端已连接: ${socket.remoteAddress}:${socket.remotePort}`);

  // 接收客户端数据
  socket.on('data', (data) => {
    const msg = data.toString().trim();
    console.log(`收到客户端消息: ${msg}`);

    // 回显数据给客户端
    socket.write(`服务器回显: ${msg}\n`);
  });

  // 客户端断开连接
  socket.on('end', () => {
    console.log('客户端已断开连接');
  });

  // 错误处理
  socket.on('error', (err) => {
    console.error(`套接字错误: ${err.message}`);
  });
});

// 启动服务器
server.listen(PORT, HOST, () => {
  console.log(`TCP 服务器正在运行，地址: ${HOST}:${PORT}`);
});

// 服务器全局错误
server.on('error', (err) => {
  console.error(`服务器错误: ${err.message}`);
});