const util = require("./util")

const TASK_STATUS = {
    progress: "Progress",
    success: "Success",
    error: "Error"
}

exports.TrainTask = class TrainTask {
    constructor(name, params, trainerID) {
        this.name = name;
        this.params = params;
        this.progress_epoch = 0;
        this.status = TASK_STATUS.progress;
        this.trainerID = trainerID;
        this.history = new util.defaultDict(Array);
    }

    update(result) {
        // 学習状況を更新
        this.progress_epoch = result.epochs;
        Object.keys(result).forEach((k) => this.history[k].push(result[k]));
    }

    end(status, result) {
        // 学習終了
        this.progress_epoch = epoch;
        this.status = status;
        Object.keys(result).forEach((k) => this.history[k].push(result[k]));
    }

    get data() {
        // 学習タスクの情報を取得する
        return {
            name: this.name,
            status: this.status,
            trainer: this.trainerID,
            epoch: this.progress_epoch,
            params: this.params,
            history: this.history
        }
    }
}
