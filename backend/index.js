// import http from "http";
// import { WebSocketServer } from "ws";
// import { spawn } from "node-pty";
// import { createServer } from "./server.js";

// const port = process.env.PORT || 5001;
// const app = createServer();
// const server = http.createServer(app);
// const wss = new WebSocketServer({ server });

// wss.on("connection", (ws) => {
//   const shell = process.platform === "win32" ? "powershell.exe" : "bash";

//   const ptyProcess = spawn(shell, [], {
//     name: "xterm-color",
//     cols: 80,
//     rows: 30,
//     cwd: process.env.HOME,
//     env: process.env,
//   });

//   ws.on("message", (msg) => {
//     const data = JSON.parse(msg.toString());
//     if (data.type === "command") {
//       ptyProcess.write(data.data);
//     }
//   });

//   ws.on("close", () => {
//     console.log("client disconnected");
//     ptyProcess.kill();
//   });

//   ptyProcess.onData((data) => {
//     ws.send(JSON.stringify({ type: "data", data }));
//   });
// });

// server.listen(port, () => {
//   console.log(`Backend running on http://localhost:${port}`);
// });
// backend/index.js
import http from "node:http";
import { WebSocketServer } from "ws";
import { createServer } from "./server.js";
import { Client as SSHClient } from "ssh2";

const port = process.env.PORT || 5001;
const app = createServer();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🌐 New WebSocket connection");
  let ssh = new SSHClient();
  let sshStream = null;

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      // Handle initial SSH connection request
      if (data.type === "connect-ssh") {
        const { host, port, username, password } = data;

        ssh
          .on("ready", () => {
            console.log(`✅ Connected to SSH ${host}:${port}`);
            ws.send(JSON.stringify({ type: "data", data: `Connected to ${host}\r\n` }));

            ssh.shell((err, stream) => {
              if (err) {
                ws.send(JSON.stringify({ type: "data", data: `SSH Shell Error: ${err.message}\r\n` }));
                return;
              }

              sshStream = stream;

              stream
                .on("data", (chunk) => {
                  ws.send(JSON.stringify({ type: "data", data: chunk.toString() }));
                })
                .on("close", () => {
                  ws.send(JSON.stringify({ type: "data", data: "\r\nSSH Session Closed\r\n" }));
                  ssh.end();
                });
            });
          })
          .on("error", (err) => {
            console.error("SSH Connection Error:", err.message);
            ws.send(JSON.stringify({ type: "data", data: `SSH Error: ${err.message}\r\n` }));
          })
          .connect({
            host,
            port: port || 22,
            username,
            password,
          });
      }

      // Handle terminal input (after connection)
      if (data.type === "ssh-input" && sshStream) {
        sshStream.write(data.data);
      }
    } catch (err) {
      console.error("Message parse error:", err);
    }
  });

  ws.on("close", () => {
    console.log("❌ WebSocket closed");
    if (ssh) ssh.end();
  });
});

server.listen(port, () => {
  console.log(`🚀 Backend server running on http://localhost:${port}`);
});
