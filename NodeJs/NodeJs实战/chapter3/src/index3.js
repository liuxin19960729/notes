const { EventEmitter } = require("events")
const util = require("util")
const fs = require("fs")

// let emitter = new EventEmitter();

// emitter.on("ss", (a) => console.log(a))

// // 去掉所有监听事件
// emitter.removeAllListeners()

// emitter.emit("ss", 111)

// // 当前有多少注册了这是事件
// emitter.listeners("xxxx").length


// 设置当前最大的监听数量 (方便查找内存泄漏 可以设置 每个key 最多绑定的数量)
// emitter = emitter.setMaxListeners(2)

// for (let i = 0; i < 4; i++) {
//     emitter.on(`key_${i}`, () => { })
// }


//============扩展事件监听器==================


function Watcher(watchDir, processDir) {
    this.watchDir = watchDir;
    this.processDir = processDir;

}


//继承
// 等同于 Watcher.prototype =new EventEmitter
// util.inherits(Watcher, EventEmitter)



// /**便利目录 */
// Watcher.prototype.watch = function () {
//     const self = this;
//     fs.readdir(this.watchDir, function (err, files) {
//         if (err) throw err;
//         files.forEach(file => self.emit("process", file))
//     })
// }


// // 启动对目录的监控
// Watcher.prototype.start = function () {
//     const self = this;
//     console.log(`watchDir:${watchDir}`)
//     fs.watchFile(self.watchDir, function () { self.watch() })
// }

// const watchDir = "./watch3";
// const processDir = "./done3";
// const watcher = new Watcher(watchDir, processDir)


// watcher.on("process", function (file) {
//     const wFile = watcher.watchDir + `/` + file;
//     const pFile = watcher.processDir + `/` + file.toLowerCase();
//     // 修改文件名字 类似于 mv 命令
//     fs.rename(wFile, pFile, function (err) {
//         if (err) throw err;
//     })
// })


// // 开启监听
// watcher.start();