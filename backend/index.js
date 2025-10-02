import http from "http";
import { WebSocketServer } from "ws";
import { spawn } from "node-pty";
import { createServer } from "./server.js";

const port = process.env.PORT || 5001;
const app = createServer();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  const shell = process.platform === "win32" ? "powershell.exe" : "bash";

  const ptyProcess = spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    if (data.type === "command") {
      ptyProcess.write(data.data);
    }
  });

  ws.on("close", () => {
    console.log("client disconnected");
    ptyProcess.kill();
  });

  ptyProcess.onData((data) => {
    ws.send(JSON.stringify({ type: "data", data }));
  });
});

server.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
