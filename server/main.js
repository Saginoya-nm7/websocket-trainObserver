const ws = require("ws");
const wsNetwork = require("./network")
const messageType = require("./messageType").messageType
const response = require("./response")

const wsSession = new wsNetwork.Session()

const server = new ws.Server({ port: 8192 })

server.on("connection", (ws) => {
    ws.on("message", (data) => {

        // 送られてきたデータをパース
        const jData = JSON.parse(data)

        switch (jData.type) {

            // セッション開始時
            case messageType.sessionStart:
                // ID登録
                const sessID = wsSession.join(ws, jData.role)
                ws.send(response.normalResponse({ id: sessID }))
                break;

            // 進捗受信時
            case messageType.progressSend:
                wsSession.broadcast(jData)
                break;

            // それ以外のmessageTypeが与えられたとき
            default:
                ws.send(response.errorResponse.messageTypeError)
                break
        }

    });
});