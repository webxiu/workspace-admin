/**
 * 检测在线用户数量
 * ws.readyState 只读属性 readyState 表示连接状态
 * 0:表示连接尚未建立。对应常量connecting，表示连接正在创建
 * 1:表示连接已建立，可以进行通信。
 * 2:表示连接正在进行关闭。
 * 3:表示连接已经关闭或者连接不能打开。
 */
class CheckOnlineWebsocket {
  socket: WebSocket = null;
  ReceiveMessageHandler = null;
  OpenConnectHandler = null;
  CloseConnectHandler = null;
  timer1 = null;
  timer2 = null;
  isOnline = true;
  channelId = null;
  url = "";

  constructor(url) {
    this.url = url;
  }

  Connect() {
    if (!("WebSocket" in window)) {
      console.log("current browser not support websocket");
      return;
    }

    if (this.IsOnline()) {
      console.log("您已经在线，不能重复上线");
      return;
    }

    const clsThis = this;
    clsThis.channelId = null;
    this.socket = new WebSocket(this.url);
    this.socket.onopen = function (e) {
      console.log("websocket connection has established");
      clsThis.ClearTimer(clsThis);
      clsThis.timer1 = window.setInterval(function () {
        if (clsThis.IsOnline()) {
          clsThis.Ping(clsThis);
        } else {
          console.log("ping fail.");
        }
      }, 5000);

      clsThis.Ping();
      clsThis.OpenConnectHandler(e);
    };
    this.socket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      if (data.msgType == "insertingCoil") {
        console.log("onmessage:", data);
      }
      if (!clsThis.channelId) clsThis.channelId = data.channelId;
      clsThis.ReceiveMessageHandler(e);
    };
    this.socket.onclose = function (e) {
      console.log("onclose:", e);
      if (clsThis.isOnline) {
        clsThis.timer2 = setTimeout(function () {
          clsThis.Connect();
        }, 5000);
      }
      clsThis.CloseConnectHandler(e);
    };
    this.socket.onerror = function (e) {
      clsThis.ClearTimer(clsThis); //连接关闭，清除登录状态
      clsThis.clearCookie();
      console.log("socket error occurred:", e);
    };
    window._onlineSocket = clsThis;
  }
  Send(message) {
    if (this.IsOnline()) {
      const msg = { message: message, type: "message" };
      this.socket.send(JSON.stringify(msg));
    } else {
      console.log("Send:", this.socket);
    }
  }
  Close() {
    if (this.IsOnline()) {
      this.ClearTimer();
      console.log("ayu: close..0");
      this.socket.close();
    } else {
      console.log(this.socket);
    }
  }
  ClearTimer(cThis = this) {
    if (cThis.timer1) window.clearInterval(cThis.timer1);
    if (cThis.timer2) window.clearTimeout(cThis.timer2);
  }
  IsOnline() {
    return this.socket && this.socket.readyState == 1;
  }
  Ping(pThis = this) {
    const s = pThis.socket;
    if (pThis.channelId) {
      s.send(JSON.stringify({ msgType: "ping", channelId: pThis.channelId }));
    } else {
      s.send(JSON.stringify({ msgType: "ping" }));
    }
  }
  clearCookie() {
    const keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
      for (let i = keys.length; i--; ) {
        //清除当前域名下的,例如：m.kevis.com
        document.cookie = keys[i] + "=0;path=/;expires=" + new Date(0).toUTCString();
        //清除当前域名下的，例如 .m.kevis.com
        document.cookie = keys[i] + "=0;path=/;domain=" + document.domain + ";expires=" + new Date(0).toUTCString();
        //清除一级域名下的或指定的，例如 .kevis.com
        document.cookie = keys[i] + "=0;path=/;domain=kevis.com;expires=" + new Date(0).toUTCString();
      }
    }
    console.log("Cookie已清除");
  }
}

export { CheckOnlineWebsocket };
