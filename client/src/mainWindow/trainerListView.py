from PyQt5 import QtWidgets, QtCore
from PyQt5.QtGui import QStandardItemModel
from PyQt5.QtGui import QStandardItem as QItem
from .taskListView import taskListView
from ..const import ResponseType, TrainStatus
from collections import defaultdict


# TODO: NetworkDataの外部クラス、カプセル化

class trainerListView:

    def __init__(self, parent=None):

        # GroupBoxを作成
        self.groupBox = QtWidgets.QGroupBox(parent)
        self.groupBox.setObjectName("TrainerListGroupBox")
        # タイトルを設定
        self.groupBox.setTitle("Trainer List")

        # Widget(TreeView) 作成
        self.widget = QtWidgets.QTreeView(self.groupBox)
        self.widget.setGeometry(QtCore.QRect(10, 20, 761, 231))
        self.widget.setObjectName("trainerListView")
        # 編集禁止
        self.widget.setEditTriggers(QtWidgets.QAbstractItemView.NoEditTriggers)

        # ヘッダーの定義
        self.widgetHeader = ["名前", "ID", "学習状況", "完了タスク数"]
        # 各列幅の最大化 (スクロールバーを表示させないよう1を引いておく)
        self.cWidth = self.widget.width() // len(self.widgetHeader) - 1

    # UIを最新の情報に更新
    def updateUI(self, dataList: list):

        # ListViewに表示するmodelを作成
        model = QStandardItemModel()
        # ヘッダーの作成
        model.setHorizontalHeaderLabels(self.widgetHeader)

        # TODO: ここに諸々のUI更新処理を書く
        for data in dataList:
            item = [
                QItem(data["name"]),
                QItem(data["id"]),
                QItem("稼働中" if data["progress"] else "待機中"),
                QItem(data["task_num"]),
            ]
            model.appendRow(item)

        self.widget.setModel(model)

        # 各列の幅を最大化
        for i in range(len(self.widgetHeader)):
            self.widget.setColumnWidth(i, self.cWidth)
