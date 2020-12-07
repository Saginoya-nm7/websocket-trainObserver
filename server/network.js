const ID_STRSET = "abcdefghijklmnopqrstuvwxyz0123456789";
const ID_LENGTH = 8;

const CLIENT_TYPE = {
    observer: "observer",
    trainer: "trainer"
}

exports.Session = class Session {
    constructor() {
        this.clients = {};
        this.IDList = { observer: [], trainer: [] };
        this.trainTasks = {};
    }

    // セッションに参加
    join(client, role) {
        // ID_LENGTH 文字のランダムな文字列を生成
        // 参考元: https://qiita.com/fukasawah/items/db7f0405564bdc37820e
        id = Array.from(Array(ID_LENGTH)).map(() => ID_STRSET[Math.floor(Math.random() * ID_STRSET.length)]).join("");

        // idと関連付けてクライアントを保存
        this.clients[id] = { obj: client, role: role };
        this.IDList[role].append(id);
        return id;
    }

    // 各observerにメッセージ送信
    broadcast(message) {
        this.IDList[CLIENT_TYPE.trainer].forEach((id) => this[id].send(message), this.IDList[CLIENT_TYPE.trainer])
    }

    //学習タスクを開始 "1-Trainer 1-Task"が前提なのでタスクは辞書で管理
    startTrainTasks(trainerID, taskName, params) {
        if (typeof Object.keys(this.IDList[CLIENT_TYPE.trainer]).find((k) => k === trainerID) != "undefined") {
            this.trainTasks[trainerID] = [];
        }
    }

    appendTrainTasks() {

    }

    endTrainTasks() {

    }
};

