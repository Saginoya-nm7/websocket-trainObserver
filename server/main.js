const { WSAESHUTDOWN } = require("constants");
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
                const sessID = wsSession.join(ws, jData.data.role)
                ws.send(response.normalResponse({ id: sessID }))
                break;

            // 学習タスクに関するメッセージ受信時
            case messageType.trainInfo:

                switch (jData.data.type) {
                    // 学習開始時
                    case messageType.train.start:
                        trainID = wsSession.startTrainTasks(jData.data.id, jData.data.data.layer, jData.data.data.params)
                        ws.send(trainID != null ? response.normalResponse({ trainID: trainID }) : response.errorResponse.unexpectedTrainIDError)
                        break;

                    // 学習進捗受信時
                    case messageType.train.update:
                        wsSession.updateTrainTasks(jData.data.trainID, jData.data.result)
                        break;

                    // 学習終了時
                    case messageType.train.end:
                        wsSession.endTrainTasks(jData.data.trainID, jData.data.status, jData.data.result)
                        break;
                }

                // Observerに学習データを配信
                // TODO: 何をどのような形式で配信するか決める
                wsSession.broadcast(jData)
                break;

            //学習タスク一覧要求時
            case messageType.getTrainList:
                break;

            //学習タスク詳細取得時
            case messageType.getTrainData:
                break;

            // それ以外のmessageTypeが与えられたとき
            default:
                ws.send(response.errorResponse.messageTypeError)
                break
        }

    });
});