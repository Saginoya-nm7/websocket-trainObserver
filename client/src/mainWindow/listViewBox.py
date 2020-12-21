from PyQt5 import QtWidgets
from .taskListView import taskListView
from .trainerListView import trainerListView
from ..classes.networkData import NetworkData
import pyqtgraph as pg
from ..graphWindow.graphWindow import GraphWindow


class listViewBox:
    def __init__(self, parent=None):
        self.verticalLayout = QtWidgets.QVBoxLayout(parent)
        self.verticalLayout.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout.setObjectName("verticalLayout")

        self.trainerListView = trainerListView(parent)
        self.taskListView = taskListView(parent)

        self.trainerListView.widget.doubleClicked.connect(self.changeShowingTaskTrainer)
        self.taskListView.widget.doubleClicked.connect(self.drawingResultGraph)
        self.TrainerIDList = []
        self.TaskIDList = []

        self.verticalLayout.addWidget(self.trainerListView.groupBox)
        self.verticalLayout.addWidget(self.taskListView.groupBox)

        # broadcastされたデータを格納しておくクラス
        self.netWorkData = NetworkData()

        self.showingTaskTrainer = None

        # グラフ表示用ウィンドウ
        self.graphWindow = None

        # ヘッダーを表示させるために初期化
        self.updateTrainerList()
        self.updateTaskList()

    def setData(self, jData: dict):
        self.netWorkData.setData(jData)
        self.updateTrainerList()

    def updateData(self, jData: dict):
        self.netWorkData.updateData(data=jData)
        self.updateTrainerList()
        self.updateTaskList()

    def updateTrainerList(self):
        trainerList = self.netWorkData.getTrainerList()
        self.TrainerIDList = [v["id"] for v in trainerList]
        self.trainerListView.updateUI(trainerList)

    def updateTaskList(self):
        taskList = self.netWorkData.getTaskFromTrainer(self.showingTaskTrainer)
        self.TaskIDList = [v["id"] for v in taskList]
        self.taskListView.updateUI(taskList)

    def changeShowingTaskTrainer(self, index):
        self.showingTaskTrainer = self.TrainerIDList[index.row()]
        self.updateTaskList()

    def drawingResultGraph(self, index):
        taskID = self.TaskIDList[index.row()]
        if self.graphWindow is not None:
            self.graphWindow.win.close()
            self.graphWindow = None
        self.graphWindow = GraphWindow(f"Graph : {taskID} ({self.showingTaskTrainer})")
        self.graphWindow.drawData(self.netWorkData.getResultDataFromTaskID(self.showingTaskTrainer, taskID))

    def graphWindowCleanUp(self):
        self.graphWindow = None
