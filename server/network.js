const ID_STRSET = "abcdefghijklmnopqrstuvwxyz0123456789"
const ID_LENGTH = 8

const CLIENT_TYPE = {
    observer: "observer",
    trainer: "trainer"
}

exports.Session = class Session {
    constructor() {
        this.clients = {};
    }

    // セッションに参加
    join(client, type) {
        // ID_LENGTH 文字のランダムな文字列を生成
        // 参考元: https://qiita.com/fukasawah/items/db7f0405564bdc37820e
        id = Array.from(Array(ID_LENGTH)).map(() => ID_STRSET[Math.floor(Math.random() * ID_STRSET.length)]).join("")

        // idと関連付けてクライアントを保存
        this.clients[id] = { obj: client, type: type }
        return id
    }

    broadcast(message) {
        // type が observer のクライアントIDを取得
        target_id = Object.keys(this.clients).filter((k) => this.clients[k].type === CLIENT_TYPE.observer)

        // 各observerにメッセージ送信
        target_id.forEach(k => {
            this.clients[k].obj.send(message)
        });
    }
}