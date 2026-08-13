# Chapter8 同步算法

## 同步算法的难点
```
1.浮点数的处理
2.对网络质量要求很高
```

## 代理范例
```js
客户端 可以收集在一段时间(0.1秒内)的所有操作 ,在一次性发送给服务端

客户端协议

 msg:{
    cmd:string;协议名
    turn:number;回合数
    ops:Array<Opt>;//操作
 }


note: turn 表示回合数  服务器会根据 turn 来判断该指令是否是过期



服务端发送给客户端的协议

msg:{
    cmd:string;协议名
    turn:number;回合数
    players:Array<{playerid:string,ops:Array<Opt>}>
}




服务器代码
 myTurn:number=0;//当前轮数
 ops:{[key:number]:{[key:string]:OPS}};
 players:Array<Palyer>=[]玩家列表

 

function msg_client_sync(playerId,msg){
    if(myturn !=msg.turn){// 不是当前轮数丢弃数据
        return;
    }
    const next=myTurn+1;//下一轮
    ops[next]=ops[next] || [];

    if(ops[next][playerId]){ // 已经存入数据不在改变
        return;
    }

    ops[next][playerId]=msg.ops;

}



服务器战斗服保存着当前全部的数据  ,如果客户端断线重连则将客户端断线期间的所有的指令数据给客户端,客户端还原状态





服务器开启一个定时器  收集所有玩家的操作 如果手机了全部玩家的操作 则广播协议
    note:为了配合搜集全部玩家操作 当前客户端没有操作 也要发送空操作协议



// 搜集指令  没隔0.1 s 调用一次on_turn
function on_turn(){
    const next_turn =myTurn+1;// 下一轮
    const next_ops=ops[next_turn];
    const player_count =Object.keys(next_ops||{}).length;

    if(player_count>=players.length){
        myTurn=next_turn;
        smsg=tomsg(next_ops);// 生成消息
        broadcast(smgs);//广播消息
    }
}



note:
     上面代码on_turn 为严格帧同步。 如果客户端执行的很慢 则其他的客户端会等待它


```