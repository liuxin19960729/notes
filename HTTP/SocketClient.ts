
export enum enSocketClientEvent {
    /**已经连接 */
    CONNECTED = "connected",
    /**断线重新连接 */
    RECONNECT = "reconnect",
    DESTORY = "destory"
}

export default class SocketClient {
    readonly url: string;
    readonly _event: cc.EventTarget;
    private _socket: WebSocket;
    private _hearBeatTimeOutId: number;
    private _reconnectTimeOutId: number;
    private _closeTimeoutId: number;
    private _reconnectCount: number = 0;
    private _isDestory: boolean = false;
    private _textEncoder: TextEncoder;
    private _textDecoder: TextDecoder;
    private readonly maxReconnectCount = 10;
    constructor(url: string) {
        this.url = url;
        this._event = new cc.EventTarget();
        this._textEncoder = new TextEncoder();
        this._textDecoder = new TextDecoder("utf-8");
    }

    connect() {
        if (!!this._socket) return;
        if (this._isDestory) return;
        const ws = new WebSocket(this.url);
        ws.binaryType = "arraybuffer";
        ws.onopen = this._onOpen.bind(this);
        ws.onclose = this._onClose.bind(this);
        ws.onmessage = this._onMessage.bind(this);
        ws.onerror = this._onError.bind(this);
        this._socket = ws;
    }


    private _send(data) {
        if (!this._socket || this._socket.readyState != WebSocket.OPEN) return;
        try {
            const uint8 = this._textEncoder.encode(JSON.stringify(data));
            this._socket.send(uint8.buffer)
        } catch (error) {
            console.error(error)
        }
    }

    private _close(code?: number, reason?: string) {
        if (!this._socket) return;
        if (this._socket.readyState != WebSocket.OPEN) return;
        this._socket.close(code, reason)
    }

    private _onOpen() {
        console.log('已连接到服务器');
        this._reconnectCount = 0;
        this._heartBeat();
    }

    private _onMessage(event) {
        try {
            console.log('收到服务器消息:', this._textDecoder.decode(event.data));
        } catch (error) {
            console.error(error)
        } finally {
            this._resetTimeOut();
            this._heartBeat();
        }
    }

    private _onClose(event) {
        console.log('连接关闭', event.code, event.reason);
        this._resetTimeOut();
        this._isDestory = this._isDestory || this._reconnectCount >= this.maxReconnectCount;
        if (!this._isDestory) {
            // 断线重连
            this._reconnectTimeOutId = setTimeout(() => {
                this._reconnectTimeOutId = undefined;
                this._socket = undefined;
                this.connect();
            }, (this._reconnectCount++) * 2 * 1000)
        }
        this._isDestory && this._event.emit(enSocketClientEvent.DESTORY)
    }
    private _onError(err) {
        console.error('WebSocket 错误', err);
    }

    private _heartBeat() {
        console.log(`_hearBeatTimeOutId :${this._hearBeatTimeOutId} _hearBeatTimeOutId:${this._closeTimeoutId} _reconnectTimeOutId:${this._reconnectTimeOutId}`)
        if (this._hearBeatTimeOutId != undefined) return;
        if (this._closeTimeoutId != undefined) return;
        if (this._reconnectTimeOutId != undefined) return;
        this._hearBeatTimeOutId = setTimeout(() => {
            this._hearBeatTimeOutId = undefined;
            this._send({ type: "ping", data: "hearbeat" })
            this._closeTimeoutId = setTimeout(() => {
                this._closeTimeoutId = undefined;
                console.log("closeTimeoutId call close")
                this._close();
            }, 5 * 1000)
        }, 5 * 1000);
    }

    private _resetTimeOut() {
        this._hearBeatTimeOutId != undefined && clearTimeout(this._hearBeatTimeOutId);
        this._closeTimeoutId != undefined && clearTimeout(this._closeTimeoutId);
        this._reconnectTimeOutId != undefined && clearTimeout(this._reconnectTimeOutId);
        this._reconnectTimeOutId = undefined;
        this._closeTimeoutId = undefined;
        this._hearBeatTimeOutId = undefined;
    }


    // 事件

    hasEventListener(type: string) {
        return this._event.hasEventListener(type);
    }

    on<T extends Function>(type: string, callback: T, target?: any): T {
        return this._event.on(type, callback, target);
    }

    off(type: string, callback?: Function, target?: any) {
        return this._event.on(type, callback, target);
    }
    targetOff(target: any) {
        return this._event.targetOff(target);
    }

}
