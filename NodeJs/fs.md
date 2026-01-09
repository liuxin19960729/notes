# FS
## fs.fdatasyncSync(fd)
```js
在Linux/Unix系统中对fdatasync(2)直接封装
    fsyncSync(fd):fd所指向的文件和文件元数据(mtime(修改时间),atime(访问时间)...) 都写入磁盘
    fdatasyncSync(fd):
            文件大小不改变只同步文件内容 
            文件大小改变同步文件内容和元数据

            note:例如 mtime(修改时间改变)不会刻意的去同步元数据
            运用场景:
                  只修改了文件几个字符对修改时间等元数据并没有任务关心使用 fdatasyncSync 可以减少一次同步inode 数据到磁盘
                1.配置文件写入
                    使用 fsyncSync对性能不重要但是对写入时间等数据重要
                2.日历追加
                    fsyncSync 和  fdatasyncSync 一样
                    每日追加会改变数据大小所以fdatasyncSync也会同步元信息

                3.数据库覆盖写入
                  数据库每一个页大一样  元数据并不重要 一般使用 fdatasyncSync 函数

```

## NodeJs 文件流详解
```js

fs.createReadStream() 返回的对象继承自 `Readable` Stream。

open:文件描述符 (fd) 被打开时 | 仅 `fs` 流特有，参数是 `fd`

ready:文件已打开且准备好被操作时 | 通常在 `open` 之后立即触发

data: 当流将数据块 (chunk) 移交给消费者时 | 核心事件，用于读取内容  note: 会被多次调用
end:文件内容已全部读完 | 表示数据流的自然结束

close:文件描述符被关闭时 | 无论成功还是出错，最后都会触发
error | 发生错误（如文件不存在、无权限） | **必须监听**，否则会导致程序崩溃


fs.createWriteStream() 返回的对象继承自 `Writable` Stream。
open
ready:准备好写入时
drain:缓存区可以继续写入数据 
finish:`stream.end()` 且所有数据已刷入底层系统 
close: 文件描述符号关闭
error:写入出错（如磁盘满、无权限） | **必须监听**


strem.end() 底层做了什么
1.用户太多buffer 已经flush
2.write 已经写入到底层缓冲区(note: 并非写入到磁盘)
3.接着会触发 finish 事件 告诉我们已经将数据提交给OS


note:
1.close 事件 只能表示fd 关闭 也并不能说明已经写入磁盘
2.90% 场景不需要调用手动调用close
    调用end()会自动自动触发关闭
    1.将数据输入OS
    2.标记写入OS
    3.关闭fd,
    4.触发close 事件


    如果 end() 之后立即调用close 则可能会调职数据丢失 ERR_STREAM_DESTROYED or 文件截断
    


```

