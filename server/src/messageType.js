exports.messageType = {
    sessionStart: "SESSION_START",
    trainInfo: "TRAIN_INFO",
    getTrainList: "GET_TRAIN_LIST",
    getTrainData: "GET_TRAIN_DATA",
    train: {
        start: "START",
        update: "UPDATE",
        end: "END",
    }
}

exports.responseType = {
    broadcast: "BROADCAST",
    grantClientID: "GRANT_CLIENT_ID",
    grantTaskID: "GRANT_TASK_ID",
    TaskList: "TASK_LIST",
    TaskDetail: "TASK_DETAIL",
    Broadcast: "BROADCAST",
    Initialize: "INITIALIZE_DATA",
    TrainerJoin: "TRAINER_JOINED",
    TaskStarted: "TASK_STARTED",
    TaskUpdated: "TASK_UPDATED",
    TaskStatus: {
        Progress: "PROGRESS",
        Update: "UPDATE",
        End: "END",
        Success: "SUCCESS",
        Error: "Error"
    }
}