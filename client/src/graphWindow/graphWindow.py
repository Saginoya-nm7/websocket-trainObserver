import pyqtgraph as pg
from typing import Iterator, Tuple
from colorsys import hls_to_rgb


def makeGraphColors(kind: int):
    return [(lambda tpl: (tpl[0] * 255, tpl[1] * 255, tpl[2] * 255))(hls_to_rgb(i / kind, 0.5, 1.0))
            for i in range(kind)]


class GraphWindow:

    def __init__(self, title: str):
        self.win = pg.GraphicsLayoutWidget(show=True)
        self.win.resize(1200, 600)
        self.win.setWindowTitle(title)

        # pg.setConfigOptions(antialias=True)

        self.graph = {
            "loss"    : self.win.addPlot(),
            "accuracy": self.win.addPlot(),
        }
        self.legend = {
            "loss"    : None,
            "accuracy": None
        }

        self.legendOffset = {
            "loss"    : (-10, 10),
            "accuracy": (-10, -10),
        }

    def drawData(self, drawData: dict):

        if drawData:
            for graphType in self.graph.keys():
                graphObj = self.graph[graphType]
                graphObj.clear()
                self.legend[graphType] = graphObj.addLegend(offset=self.legendOffset[graphType])
                color = makeGraphColors(len(drawData[graphType]))
                for idx, (name, data) in enumerate(drawData[graphType].items()):
                    # 空データを除いてグラフをプロット
                    if data:
                        graphObj.plot(x=range(len(data)), y=data, pen=color[idx], name=name)
