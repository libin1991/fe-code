class Socket {
    constructor({timeout, url, onmessage}) {
        this.socketUrl = url;
        this.timeout= timeout || 1000;
        this.ws = null;
        this.lockReconnect = true;
        this.notReconnect = false;
        this.onmessage = onmessage;
        this.init();
    }
    reset() {
        clearTimeout(this.timeoutObj);
        this.start();
    }
    start() {
        this.timeoutObj = setTimeout(() => {
            this.ws.send("HeartBeat");
        }, this.timeout);
    }
    init() {
        if('WebSocket' in window){
            this.ws = new WebSocket(this.socketUrl);
            this.eventHandle();
        }else{
            console.log('您的浏览器不支持websocket协议,建议使用新版谷歌、火狐等浏览器');
        }
    }
    eventHandle() {
        this.ws.onclose = () => {
            console.log('ws:// 链接关闭');
            this.reconnect();
        };
        this.ws.onerror = () => {
            console.log('ws:// 链接出错');
            this.reconnect();
        };
        this.ws.onopen = () => {
            console.log('ws:// 链接成功');
            this.start();
        };
        this.ws.onmessage = (event) => {
            this.onmessage(event);
            this.reset();
        }
    }
    reconnect() {
        console.log('ws:// 正在重连');
        if(this.lockReconnect) return;
        if (this.notReconnect) return;
        this.lockReconnect = true;
        setTimeout(() => {    //没连接上会一直重连，设置延迟避免请求过多
            this.init();
            this.lockReconnect = false;
        }, 5000);
    }
    close() {
        this.notReconnect = true;
        this.ws.close();
    }
    send(val) {
        this.ws.send(val);
    }
}
export {
    Socket
}