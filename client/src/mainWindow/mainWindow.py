from .UI.mainWindow import Ui_mainWindow
from PyQt5 import QtWidgets
from PyQt5.QtWidgets import QMainWindow
from PyQt5 import QtWebSockets as Qws
from PyQt5.QtCore import QUrl
import src.const as const
import json
from .listViewBox import listViewBox


class mainWindow(QMainWindow, Ui_mainWindow):

    def __init__(self):
        super(QMainWindow, self).__init__()
        self.setupUi(self)

        self.listViewBox = listViewBox(self.widget)

        self.statusbar.showMessage("Connecting...")

        # Websocketクライアント作成
        self.client = Qws.QWebSocket("", Qws.QWebSocketProtocol.Version13, None)
        self.client.textMessageReceived.connect(self.onMessageReceived)

        self.client.error.connect(self.onErrorOccurred)
        self.client.connected.connect(self.onConnected)

        self.client.open(QUrl(f"ws://{const.WS_URL}:{const.WS_PORT}"))

        self.clientID = ""

    def onConnected(self):
        self.statusbar.showMessage("Connected!")
        print(f"status: -> {self.client.state()}")
        self.client.sendTextMessage(
            self.createTextMessage(
                messageType=const.MessageType.sessionStart,
                messageJson={"role": const.Role.observer}
            )
        )

    # メッセージ受信時イベント
    def onMessageReceived(self, message):
        obj = json.loads(message)

        # サーバーからClient IDを受け取ったとき
        if obj["type"] == const.ResponseType.grantClientID:
            self.clientID = obj["data"]["id"]
            self.statusbar.showMessage(f"Connected! (clientID: {self.clientID})")

        # サーバーから情報を受け取ったとき
        if obj["type"] == const.ResponseType.Broadcast:
            self.updateUI(obj["data"])

        if obj["type"] == const.ResponseType.InitData:
            self.setData(obj["data"])

    # 受け取ったデータでネットワークを初期化
    def setData(self, jData: dict):
        self.listViewBox.setData(jData)

    # 受け取ったデータを基にUIを更新する
    def updateUI(self, jData: dict):
        self.listViewBox.updateData(jData)

    # メッセージ作成用
    @staticmethod
    def createTextMessage(messageType: str, messageJson: dict) -> str:
        return json.dumps({"type": messageType, "data": messageJson})

    # 通信エラー発生時イベント
    @staticmethod
    def onErrorOccurred(code):
        print(const.createSocketErrorMessage(code))
        exit()
