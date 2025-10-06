// import { useEffect, useRef } from "react";
// import { Terminal } from "xterm";
// import "xterm/css/xterm.css";

// export default function XTerminal() {
//   const terminalRef = useRef(null);
//   const wsRef = useRef(null);
//   const termRef = useRef(null);

//   useEffect(() => {
//     const term = new Terminal({
//       cursorBlink: true,
//       fontSize: 14,
//       theme: { background: "#000000" },
//     });
//     termRef.current = term;
//     term.open(terminalRef.current);

//     const wsUrl =
//       window.location.protocol === "https:"
//         ? "wss://localhost:5001"
//         : "ws://localhost:5001";

//     const ws = new WebSocket(wsUrl);
//     wsRef.current = ws;

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === "data") {
//         term.write(data.data);
//       }
//     };

//     term.onData((data) => {
//       ws.send(JSON.stringify({ type: "command", data }));
//     });

//     return () => {
//       ws.close();
//       term.dispose();
//     };
//   }, []);

//   return <div ref={terminalRef} style={{ height: "100%", width: "100%" }} />;
// }
import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import "./styles/terminal.css";
import "./styles/form.css";

export default function XTerminal() {
  const terminalRef = useRef(null);
  const wsRef = useRef(null);
  const termRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [form, setForm] = useState({
    host: "",
    port: 22,
    username: "",
    password: "",
  });

  const connectSSH = () => {
    const wsUrl =
      window.location.protocol === "https:"
        ? "wss://localhost:5001"
        : "ws://localhost:5001";

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: { background: "#000000", foreground: "#00FF00" },
    });
    termRef.current = term;
    term.open(terminalRef.current);

    ws.onopen = () => {
      term.writeln("Connecting to SSH server...");
      ws.send(
        JSON.stringify({
          type: "connect-ssh",
          host: form.host,
          port: parseInt(form.port, 10),
          username: form.username,
          password: form.password,
        })
      );
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "data") term.write(data.data);
    };

    ws.onclose = () => {
      term.writeln("\r\n*** Connection closed ***");
      setConnected(false);
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ssh-input", data }));
      }
    });
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (termRef.current) termRef.current.dispose();
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {!connected ? (
        <div className="ssh-form">
          <h2>SSH Connection</h2>
          <input
            placeholder="Host"
            value={form.host}
            onChange={(e) => setForm({ ...form, host: e.target.value })}
          />
          <input
            placeholder="Port"
            type="number"
            value={form.port}
            onChange={(e) => setForm({ ...form, port: e.target.value })}
          />
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button onClick={connectSSH}>Connect</button>
        </div>
      ) : null}

      <div ref={terminalRef} className="terminal-container" />
    </div>
  );
}
