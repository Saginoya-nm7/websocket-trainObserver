from ..const import ResponseType, TrainStatus
from collections import defaultdict


class NetworkData:

    def __init__(self):
        self.obj = {}
        self.taskProgress_Translate = {
            TrainStatus.Start   : "初期化中",
            TrainStatus.Progress: "進行中 ({progress_epoch}/{epoch})",
            # TODO: 正常終了とエラー終了の区別を付ける
            TrainStatus.Success : "正常終了",
            TrainStatus.Error   : "終了(エラー)",

        }

    def setData(self, jData: dict):
        dataObj = jData["trainer"]
        for trainerID, trainerData in dataObj.items():
            self.obj[trainerID] = {
                "trainerName": trainerData["name"],
                "progress"   : trainerData["progress"],
                "tasks"      : {}
            }
            for taskID, taskData in trainerData["tasks"].items():
                self.obj[trainerID]["tasks"][taskID] = {
                    "taskName": taskData["name"],
                    "params"  : taskData["params"],
                    "status"  : TrainStatus.Progress if trainerData["progress"] == taskID else TrainStatus.Success,
                    "epoch"   : taskData["epoch"],
                    "startTime": taskData["startTime"],
                    "history" : defaultdict(list, taskData["history"]),
                }

    # Trainer一覧を取得
    def getTrainerList(self) -> list:
        res = []
        for trainerID, trainerData in self.obj.items():
            res.append({
                "name"    : trainerData["trainerName"],
                "id"      : trainerID,
                "progress": trainerData["progress"],
                "task_num": str(len(list(trainerData["tasks"].keys()))),
            })

        return res

    # TrainerIDからTaskを取得
    def getTaskFromTrainer(self, trainerID: str = None) -> list:
        res = []

        if trainerID is None:
            return res

        for taskID, taskData in self.obj[trainerID]["tasks"].items():
            if taskData["status"] == TrainStatus.Progress:
                status = self.taskProgress_Translate[taskData["status"]].format(
                    progress_epoch=taskData['epoch'], epoch=taskData['params']['epochs'])
            else:
                status = self.taskProgress_Translate[taskData["status"]]

            res.append({
                "name"  : taskData["taskName"],
                "id"    : taskID,
                "status": status,
                "date"  : taskData["startTime"],
                "detail": " ".join([f"{k}:{v}" for k, v in taskData["params"].items()]),
            })

        return res

    def getResultDataFromTaskID(self, trainerID: str, taskID: str) -> dict:
        return dict(self.obj[trainerID]["tasks"][taskID]["history"])

    # 更新分のデータを反映
    def updateData(self, data: dict):

        # TrainerがNetworkにJoinしたときに配信されるデータを反映
        if data["type"] == ResponseType.TrainerJoin:
            trainerData = data["data"]
            self.createTrainer(trainerID=trainerData["ID"], trainerName=trainerData["trainerName"])

        # Task作成時に配信されるデータを反映
        if data["type"] == ResponseType.TaskStarted:
            taskData = data["data"]
            trainerID = taskData["trainerID"]
            taskID = taskData["taskID"]

            self.createTask(trainerID=trainerID, taskID=taskID, taskData=taskData)

        # Task更新時に配信されるデータを反映
        if data["type"] == ResponseType.TaskUpdated:
            detail = data["data"]

            # タスク進行
            if detail["type"] == ResponseType.TaskStatus.Update:
                trainerID = detail["trainerID"]
                taskID = detail["taskID"]

                taskData = detail["data"]
                epoch = detail["epoch"]

                self.updateTask(trainerID=trainerID, taskID=taskID, epoch=epoch, updateData=taskData)

            # タスク終了
            if detail["type"] == ResponseType.TaskStatus.End:
                trainerID = detail["trainerID"]
                taskID = detail["taskID"]

                status = detail["status"]
                self.endTask(trainerID=trainerID, taskID=taskID, status=status)

    # Trainer作成
    def createTrainer(self, trainerID: str, trainerName: str):
        self.obj[trainerID] = {"trainerName": trainerName, "progress": None, "tasks": {}}

    # Task作成
    def createTask(self, trainerID: str, taskID: str, taskData: dict):
        self.obj[trainerID]["tasks"][taskID] = {
            "taskName": taskData["taskName"],
            "params"  : taskData["data"],
            "status"  : taskData["type"],
            "epoch"   : taskData["epoch"],
            "startTime": taskData["startTime"],
            "history" : defaultdict(lambda : defaultdict(list))
        }
        self.obj[trainerID]["progress"] = taskID

    # Task更新
    def updateTask(self, trainerID: str, taskID: str, epoch: int, updateData: dict):
        self.obj[trainerID]["tasks"][taskID]["epoch"] = epoch
        self.obj[trainerID]["tasks"][taskID]["status"] = TrainStatus.Progress

        for k in updateData.keys():
            for kk in updateData[k].keys():
                self.obj[trainerID]["tasks"][taskID]["history"][k][kk].append(updateData[k][kk])

    # Task終了
    def endTask(self, trainerID: str, taskID: str, status: str):
        self.obj[trainerID]["tasks"][taskID]["status"] = status
        self.obj[trainerID]["progress"] = None
