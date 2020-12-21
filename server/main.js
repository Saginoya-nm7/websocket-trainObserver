const ws = require("ws");
const wsNetwork = require("./src/network")
const messageType = require("./src/messageType").messageType
const responseType = require("./src/messageType").responseType
const response = require("./src/response")

const wsSession = new wsNetwork.Session()

const server = new ws.Server({ port: 8765 })

server.on("connection", (ws) => {
    ws.on("message", (data) => {

        console.log(data)

        // 送られてきたデータをパース
        const jData = JSON.parse(data)

        switch (jData.type) {

            // セッション開始時
            case messageType.sessionStart:
                // ID登録
                const trainerName = "hogehoge"
                const sessID = wsSession.join(ws, trainerName, jData.data.role)
                ws.send(response.normalResponse(responseType.grantClientID, { id: sessID }))

                switch (jData.data.role) {
                    case "observer":
                        // observerがJoin時に初期化用のデータを配信
                        ws.send(response.normalResponse(responseType.Initialize, wsSession.getNetWorkData()));
                        break;

                    case "trainer":
                        //trainerがjoin時、既に接続しているobsrverに接続を通知
                        wsSession.broadcast(response.normalResponse_object(responseType.TrainerJoin, {
                            ID: sessID,
                            trainerName: trainerName,
                        }))
                }

                break;

            // 学習タスクに関するメッセージ受信時
            case messageType.trainInfo:
                const trainerID = jData.data.id
                const trainData = jData.data.data
                switch (jData.data.type) {

                    // 学習開始時
                    case messageType.train.start:
                        const taskName = jData.data.name
                        const taskID = wsSession.startTrainTasks(jData.data.id, taskName, trainData)
                        ws.send(taskID != null ? response.normalResponse(responseType.grantTaskID, { taskID: taskID }) : response.errorResponse.unexpectedTrainIDError)
                        wsSession.broadcast(response.normalResponse_object(responseType.TaskStarted, {
                            trainerID: trainerID,
                            taskID: taskID,
                            taskName: taskName,
                            type: messageType.train.start,
                            epoch: 0,
                            startTime: wsSession.trainTasks[taskID].data.startTime,
                            status: jData.data.type,
                            data: trainData
                        }))
                        break;

                    // 学習進捗受信時
                    case messageType.train.update:
                        wsSession.updateTrainTasks(jData.data.id, trainData.id, trainData.epoch, trainData.result)
                        wsSession.broadcast(response.normalResponse_object(responseType.TaskUpdated, {
                            trainerID: jData.data.id,
                            taskID: trainData.id,
                            type: responseType.TaskStatus.Update,
                            epoch: trainData.epoch,
                            status: responseType.TaskStatus.Progress,
                            data: trainData.result
                        }))
                        break;

                    // 学習終了時
                    case messageType.train.end:
                        wsSession.endTrainTasks(jData.data.id, trainData.id, trainData.status, trainData.result)
                        wsSession.broadcast(response.normalResponse_object(responseType.TaskUpdated, {
                            trainerID: jData.data.id,
                            taskID: trainData.id,
                            type: responseType.TaskStatus.End,
                            epoch: trainData.epoch,
                            status: trainData.status,
                            data: trainData.result
                        }))
                        break;
                }
                break;

            // それ以外のmessageTypeが与えられたとき
            default:
                ws.send(response.errorResponse.messageTypeError)
                break;
        }
    });
});