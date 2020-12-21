import sys
from PyQt5.QtWidgets import QApplication
from src.mainWindow.mainWindow import mainWindow

app = QApplication(sys.argv)
window = mainWindow()
window.show()

sys.exit(app.exec_())
