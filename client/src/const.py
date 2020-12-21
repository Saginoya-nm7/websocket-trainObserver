# 定数宣言用ファイル

# Websocketのアドレス
WS_URL = "153.120.128.162"
# Websocketのポート
WS_PORT = 8765


# サーバーに送るデータの識別用定数
class MessageType:
    sessionStart = "SESSION_START"
    trainInfo = "TRAIN_INFO"
    getTrainList = "GET_TRAIN_LIST"
    getTrainData = "GET_TRAIN_DATA"

    class TrainStatus:
        start = "START"
        update = "UPDATE"
        end = "END"
        success = "SUCCESS"
        error = "ERROR"


# クライアントが学習機か監視機かの判別用定数
class Role:
    observer = "observer"
    trainer = "trainer"


# サーバーから送られてくるデータの識別用定数
class ResponseType:
    grantClientID = "GRANT_CLIENT_ID"
    grantTaskID = "GRANT_TASK_ID"
    TaskList = "TASK_LIST"
    TaskDetail = "TASK_DETAIL"
    Broadcast = "BROADCAST"
    InitData = "INITIALIZE_DATA"
    TrainerJoin = "TRAINER_JOINED"
    TaskStarted = "TASK_STARTED"
    TaskUpdated = "TASK_UPDATED"

    class TaskStatus:
        Update = "UPDATE"
        End = "END"


# 学習状況の定数
# TODO: エラー終了と正常終了の区別
class TrainStatus:
    Start = "START"
    Progress = "PROGRESS"
    End = "END"
    Success = "SUCCESS"
    Error = "Error"


# Websocketのエラーに関するメッセージ作成用クラス
class SocketErrorMessage:
    def __init__(self):
        self.error = [
            "UnconnectedState",
            "HostLookupState",
            "ConnectingState",
            "ConnectedState",
            "BoundState",
            "ListeningState",
            "ClosingState",
        ]
        self.details = [
            "The socket is not connected.",
            "The socket is performing a host name lookup.",
            "The socket has started establishing a connection.",
            "A connection is established."
            "The socket is bound to an address and port.",
            "For internal use only.",
            "The socket is about to close (data may still be waiting to be written).",
        ]


socketErrorMessage = SocketErrorMessage()


# Websocketのstatusからメッセージを作成して返す関数
def createSocketErrorMessage(state):
    return f"[{socketErrorMessage.error[state]}] {socketErrorMessage.details[state]} (code: {state})"
