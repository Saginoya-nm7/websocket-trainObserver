const util = require("./util")
const dateformat = require("dateformat")

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
        this.startTime = dateformat(new Date(), "mm/dd HH:MM:ss")
        this.history = {
            "loss": new util.defaultDict(Array),
            "accuracy": new util.defaultDict(Array),
        };
    }

    update(epoch, result) {
        // 学習状況を更新
        this.progress_epoch = epoch;
        Object.keys(result).forEach((c) => {
            Object.keys(result[c]).forEach((k) => this.history[c][k].push(result[c][k]))
        });
    }

    end(status) {
        // 学習終了
        this.status = status;
    }

    get data() {
        // 学習タスクの情報を取得する
        return {
            name: this.name,
            status: this.status,
            trainer: this.trainerID,
            epoch: this.progress_epoch,
            startTime: this.startTime,
            params: this.params,
            history: this.history
        }
    }
}
