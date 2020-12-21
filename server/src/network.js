
const TrainTask = require("./task").TrainTask
const response = require("./response")
const responseType = require("./messageType").responseType
const util = require("./util")

const ID_LENGTH = 8;

const CLIENT_TYPE = {
    observer: "observer",
    trainer: "trainer"
}

const result = {
    taskIDNotFound: -1
}

exports.result = result;

exports.Session = class Session {
    constructor() {
        this.clients = { observer: {}, trainer: {} };
        this.trainData = {}
        this.trainTasks = {};
    }

    // セッションに参加
    join(client, name, role) {

        // length 文字のランダムな文字列を生成
        const clientID = util.makeRandomStr(ID_LENGTH)
        // idと関連付けてクライアントを保存
        if (role == CLIENT_TYPE.trainer) {
            this.clients.trainer[clientID] = client;
            this.trainData[clientID] = { name: name, role: role, progress: null, tasks: {} }

        } else if (role == CLIENT_TYPE.observer) {
            this.clients.observer[clientID] = client;
        }


        return clientID;
    }

    // 各observerにメッセージ送信
    broadcast(data) {
        const jMessage = response.normalResponse(responseType.Broadcast, data)
        Object.keys(this.clients.observer).forEach((id) => this.clients.observer[id].send(jMessage))
        /*this.IDList[CLIENT_TYPE.trainer].forEach((id) => this[id].send(jMessage), this.IDList[CLIENT_TYPE.trainer])*/
    }

    //学習タスクを開始 TaskIDを返す
    startTrainTasks(trainerID, name, params) {
        // 該当のtrainerIDがあるかどうかチェック
        if (!trainerID in this.clients.trainer) {
            return null;
        }
        // タスク登録
        const taskID = util.makeRandomStr(ID_LENGTH)
        this.trainTasks[taskID] = new TrainTask(name, params, trainerID);
        this.trainData[trainerID].progress = taskID
        this.trainData[trainerID].tasks[taskID] = this.trainTasks[taskID].data

        return taskID
    }

    // 学習タスク更新
    updateTrainTasks(trainerID, taskID, epoch, params) {
        this.trainTasks[taskID].update(epoch, params)
        this.trainData[trainerID].tasks[taskID] = this.trainTasks[taskID].data
    }

    // 学習タスク終了
    endTrainTasks(trainerID, taskID, status) {
        this.trainTasks[taskID].end(status)
        this.trainData[trainerID].progress = null
    }

    /*
    getTaskList() {
        return Object.keys(this.trainTasks)
    }

    getTask(taskID) {
        if (taskID in this.trainTasks) {
            return this.trainTasks[taskID].data();
        } else {
            return result.taskIDNotFound;
        }
    }
    */

    // 接続してきたobserverに渡すデータを作成
    getNetWorkData() {
        return { trainer: this.trainData }
        /*
        // Trainerのデータを取得
        var trainerData = {}
        // TrainerIDを全探索
        this.IDList.trainer.forEach((id) => {
            taskList = {}

            // TrainerIDがidと等しいタスクのみを取得
            Object.keys(this.trainTasks).map((taskID) => this.trainTasks[taskID].trainerID == id)
                // 詳細を取得
                .forEach((_taskID) => {
                    const targetTask = this.trainTasks
                    taskList[_taskID] = {
                        taskName: targetTask.name,
                        params: targetTask.params,
                        status: targetTask.status,
                        epoch: targetTask.progress_epoch + "/" + targetTask.params.epoch,
                        history: targetTask.history,
                    }
                })

            // レスポンスデータに代入
            trainerData[id] = {
                trainerName: this.clients[id].name,
                progress: this.clients[id].taskID,
                tasks: taskList,
            }
        })

        return response.normalResponse(responseType.Broadcast, { trainer: trainerData })
        */
    }
};
