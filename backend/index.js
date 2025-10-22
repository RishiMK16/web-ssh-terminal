import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
import { Client as SSHClient } from "ssh2";

// Express app setup
function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/status", (req, res) => {
    res.json({ ok: true });
  });

  return app;
}

// SSH connection handler
function handleSSHConnection(ws, sshConfig) {
  const ssh = new SSHClient();
  let sshStream = null;

  ssh
    .on("ready", () => {
      ws.send(JSON.stringify({ type: "data", data: `Connected to ${sshConfig.host}\r\n` }));
      ssh.shell((err, stream) => {
        if (err) {
          ws.send(JSON.stringify({ type: "data", data: `Shell error: ${err.message}\r\n` }));
          return;
        }
        sshStream = stream;
        stream.on("data", (chunk) => {
          ws.send(JSON.stringify({ type: "data", data: chunk.toString() }));
        });
        stream.on("close", () => {
          ws.send(JSON.stringify({ type: "data", data: "\r\n*** SSH Session closed ***\r\n" }));
          ssh.end();
        });
      });
    })
    .on("error", (err) => {
      ws.send(JSON.stringify({ type: "data", data: `SSH Error: ${err.message}\r\n` }));
    })
    .on("close", () => {
      ws.send(JSON.stringify({ type: "data", data: "\r\n*** SSH Disconnected ***\r\n" }));
    })
    .connect(sshConfig);

  return {
    write: (data) => sshStream && sshStream.write(data),
    end: () => ssh.end(),
  };
}

// WebSocket connection handler
function handleWSConnection(ws) {
  let sshSession = null;
  ws.send(JSON.stringify({ type: "data", data: "Connected to backend\r\n" }));

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type === "connect-ssh") {
        sshSession = handleSSHConnection(ws, {
          host: data.host,
          username: data.username,
          password: data.password,
        });
      }
      if (data.type === "ssh-input" && sshSession) {
        sshSession.write(data.data);
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: "data", data: `WS Parse error: ${e.message}\r\n` }));
    }
  });

  ws.on("close", () => {
    if (sshSession) sshSession.end();
  });
}

// Main server setup
function startServer() {
  const app = createApp();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on("connection", handleWSConnection);

  const PORT = 5001;
  server.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
}
startServer();