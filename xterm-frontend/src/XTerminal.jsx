import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

export default function XTerminal() {
  const terminalRef = useRef(null);
  const wsRef = useRef(null);
  const termRef = useRef(null);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: { background: "#000000" },
    });
    termRef.current = term;
    term.open(terminalRef.current);

    const wsUrl =
      window.location.protocol === "https:"
        ? "wss://localhost:5001"
        : "ws://localhost:5001";

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "data") {
        term.write(data.data);
      }
    };

    term.onData((data) => {
      ws.send(JSON.stringify({ type: "command", data }));
    });

    return () => {
      ws.close();
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} style={{ height: "100%", width: "100%" }} />;
}
