!
    function(a, b, c) {
        function d(c) {
            var d = b.createElement("iframe"),
                e = "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=" + c.appid + "&agentid=" + c.agentid + "&redirect_uri=" + c.redirect_uri + "&state=" + c.state + "&login_type=jssdk";
            e += c.style ? "&style=" + c.style: "",
                e += c.href ? "&href=" + c.href: "",
                d.src = e,
                d.frameBorder = "0",
                d.allowTransparency = "true",
                d.scrolling = "no",
                d.width = "300px",
                d.height = "400px";
                var f = b.getElementById(c.id);
                f.innerHTML = "",
                d.onload = function()
                {
                    d.contentWindow.postMessage && a.addEventListener && (a.addEventListener("message",
                        function(b) {
                            b.data && b.origin.indexOf("work.weixin.qq.com") > -1 && (a.location.href = b.data)
                        }), d.contentWindow.postMessage("ask_usePostMessage", "*"))
                },
                f.appendChild(d)
        }
        a.wxlogin = d
    } (window, document);