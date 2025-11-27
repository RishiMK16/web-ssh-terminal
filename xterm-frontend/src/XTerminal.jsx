// import { useEffect, useRef, useState } from "react";
// import { Terminal } from "xterm";
// import "xterm/css/xterm.css";
// import "./styles/terminal.css";
// import "./styles/form.css";

// export default function XTerminal() {
//   const terminalRef = useRef(null);
//   const wsRef = useRef(null);
//   const termRef = useRef(null);

//   const [connected, setConnected] = useState(false);
//   const [form, setForm] = useState({
//     host: "localhost",
//     port: 22,
//     username: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const connectSSH = () => {
//     setLoading(true);
//     setError("");
//     const backendPort = 5002;
//     const protocol = window.location.protocol === "https:" ? "wss" : "ws";
//     const wsUrl = `${protocol}://localhost:${backendPort}`;

//     const ws = new WebSocket(wsUrl);
//     wsRef.current = ws;

//     const term = new Terminal({
//       cursorBlink: true,
//       fontSize: 16,
//       theme: { background: "#181818", foreground: "#00FF00" },
//       fontFamily: "Fira Mono, monospace",
//       rows: 30,
//       cols: 90,
//     });
//     termRef.current = term;
//     term.open(terminalRef.current);

//     ws.onopen = () => {
//       term.writeln("\x1b[1;36mConnecting to SSH server...\x1b[0m");
//       ws.send(
//         JSON.stringify({
//           type: "connect-ssh",
//           host: form.host,
//           port: Number(form.port),
//           username: form.username,
//           password: form.password,
//         })
//       );
//       setConnected(true);
//       setLoading(false);
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.type === "data") term.write(data.data);
//         if (data.type === "error") {
//           setError(data.message || "SSH connection failed.");
//           term.writeln(`\r\n\x1b[1;31m${data.message}\x1b[0m`);
//         }
//       } catch (err) {
//         term.writeln("\r\n\x1b[1;31mError parsing message\x1b[0m");
//       }
//     };

//     ws.onerror = () => {
//       term.writeln("\r\n\x1b[1;31m*** WebSocket error ***\x1b[0m");
//       setError("WebSocket error. Please check your connection.");
//       setLoading(false);
//     };

//     ws.onclose = () => {
//       term.writeln("\r\n\x1b[1;33m*** Connection closed ***\x1b[0m");
//       setConnected(false);
//       setLoading(false);
//     };

//     term.onData((data) => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({ type: "ssh-input", data }));
//       }
//     });
//   };

//   useEffect(() => {
//     return () => {
//       wsRef.current?.close();
//       termRef.current?.dispose();
//     };
//   }, []);

//   return (
//     <div className="terminal-page" style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", background: "#222" }}>
//       {!connected && (
//         <div className="ssh-form" style={{
//           background: "#282c34",
//           padding: "2rem 2.5rem",
//           borderRadius: "12px",
//           boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
//           marginTop: "4rem",
//           minWidth: "340px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "1.2rem"
//         }}>
//           <h2 style={{ color: "#00FF00", marginBottom: "0.5rem", textAlign: "center" }}>SSH Connection</h2>

//           <input
//             placeholder="Host"
//             value={form.host}
//             onChange={(e) => setForm({ ...form, host: e.target.value })}
//             style={{
//               padding: "0.7rem",
//               borderRadius: "6px",
//               border: "1px solid #444",
//               background: "#222",
//               color: "#fff",
//               fontSize: "1rem"
//             }}
//             autoFocus
//           />

//           <input
//             placeholder="Port"
//             type="number"
//             value={form.port}
//             onChange={(e) => setForm({ ...form, port: e.target.value })}
//             style={{
//               padding: "0.7rem",
//               borderRadius: "6px",
//               border: "1px solid #444",
//               background: "#222",
//               color: "#fff",
//               fontSize: "1rem"
//             }}
//           />

//           <input
//             placeholder="Username"
//             value={form.username}
//             onChange={(e) => setForm({ ...form, username: e.target.value })}
//             style={{
//               padding: "0.7rem",
//               borderRadius: "6px",
//               border: "1px solid #444",
//               background: "#222",
//               color: "#fff",
//               fontSize: "1rem"
//             }}
//           />

//           <input
//             placeholder="Password"
//             type="password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             style={{
//               padding: "0.7rem",
//               borderRadius: "6px",
//               border: "1px solid #444",
//               background: "#222",
//               color: "#fff",
//               fontSize: "1rem"
//             }}
//           />

//           <button
//             onClick={connectSSH}
//             disabled={loading || !form.host || !form.username || !form.password}
//             style={{
//               background: loading ? "#444" : "#00FF00",
//               color: "#222",
//               fontWeight: "bold",
//               padding: "0.8rem",
//               borderRadius: "6px",
//               border: "none",
//               cursor: loading ? "not-allowed" : "pointer",
//               fontSize: "1.1rem",
//               marginTop: "0.5rem",
//               transition: "background 0.2s"
//             }}
//           >
//             {loading ? "Connecting..." : "Connect"}
//           </button>
//           {error && (
//             <div style={{ color: "#ff4d4f", marginTop: "0.5rem", textAlign: "center", fontWeight: "bold" }}>
//               {error}
//             </div>
//           )}
//         </div>
//       )}

//       <div
//         ref={terminalRef}
//         className="terminal-container"
//         style={{
//           width: "900px",
//           height: "520px",
//           marginTop: connected ? "2rem" : "3rem",
//           borderRadius: "12px",
//           overflow: "hidden",
//           boxShadow: connected ? "0 4px 24px rgba(0,255,0,0.15)" : "none",
//           border: connected ? "2px solid #00FF00" : "none",
//           background: "#181818"
//         }}
//       />
//     </div>
//   );
// }import { useEffect, useRef, useState } from "react";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import "./styles/terminal.css" // unified CSS file

export default function XTerminal() {
  const terminalRef = useRef(null);
  const wsRef = useRef(null);
  const termRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [form, setForm] = useState({
    host: "localhost",
    port: 22,
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connectSSH = () => {
    setLoading(true);
    setError("");
    const backendPort = 5001;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${protocol}://localhost:${backendPort}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: { background: "#0d1117", foreground: "#00ffb3" },
      fontFamily: "Fira Code, monospace",
      rows: 30,
      cols: 90,
    });
    termRef.current = term;

    if (terminalRef.current) term.open(terminalRef.current);

    ws.onopen = () => {
      term.writeln("\x1b[1;36mConnecting to SSH server...\x1b[0m");
      ws.send(
        JSON.stringify({
          type: "connect-ssh",
          host: form.host,
          port: Number(form.port),
          username: form.username,
          password: form.password,
        })
      );
      setConnected(true);
      setLoading(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "data") term.write(data.data);
        if (data.type === "error") {
          setError(data.message || "SSH connection failed.");
          term.writeln(`\r\n\x1b[1;31m${data.message}\x1b[0m`);
        }
      } catch {
        term.writeln("\r\n\x1b[1;31mError parsing message\x1b[0m");
      }
    };

    ws.onerror = () => {
      term.writeln("\r\n\x1b[1;31m*** WebSocket error ***\x1b[0m");
      setError("WebSocket error. Please check your connection.");
      setLoading(false);
    };

    ws.onclose = () => {
      term.writeln("\r\n\x1b[1;33m*** Connection closed ***\x1b[0m");
      setConnected(false);
      setLoading(false);
    };

    term.onData((data) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ssh-input", data }));
      }
    });
  };

  useEffect(() => {
    return () => {
      wsRef.current?.close();
      termRef.current?.dispose();
    };
  }, []);

  return (
    <div className="terminal-page">
      {!connected && (
        <div className="ssh-form">
          <h2>SSH Connection</h2>

          <input
            placeholder="Host"
            value={form.host}
            onChange={(e) => setForm({ ...form, host: e.target.value })}
            autoFocus
          />

          <input
            placeholder="Port"
            type="number"
            value={form.port}
            onChange={(e) => setForm({ ...form, port: Number(e.target.value) })}
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

          <button
            onClick={connectSSH}
            disabled={loading || !form.host || !form.username || !form.password}
          >
            {loading ? "Connecting..." : "Connect"}
          </button>

          {error && <div className="error-text">{error}</div>}
        </div>
      )}

      <div
        ref={terminalRef}
        className={`terminal-container ${connected ? "visible" : "hidden"}`}
      />
    </div>
  );
}
