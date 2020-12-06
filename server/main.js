const ws = require("ws");

const server = new ws.Server({ port: 8192 })

server.on("connection", (ws) => {
    ws.on("message", (data) => {

    });
});