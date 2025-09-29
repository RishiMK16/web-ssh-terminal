// Use the global UMD builds included via CDN in index.html.
// The UMD scripts may expose different shapes depending on bundling.
// Try common export shapes (direct, default, or named property).
function resolveGlobal(name, altPaths = []) {
  const val = altPaths.reduce((acc, p) => acc || (window[p] && window[p][name]), window[name]);
  if (!val) return undefined;
  return val.default || val[name] || val;
}

const Terminal = resolveGlobal('Terminal', ['xterm', 'Xterm']);
const FitAddon = resolveGlobal('FitAddon', ['xterm', 'Xterm', 'fit', 'xtermFit']);

if (!Terminal) {
  throw new Error('xterm Terminal not found on window. Make sure the xterm UMD script is loaded before this module.');
}
if (!FitAddon) {
  throw new Error('xterm FitAddon not found on window. Make sure the xterm-addon-fit UMD script is loaded before this module.');
}

class TerminalSetup {
  constructor(containerId) {
    this.term = new Terminal({
      cursorBlink: true,
      fontSize: 16,
      theme: {
        background: "#1e1e1e",
        foreground: "#00ff00",
        cursor: "#ff0000"
      }
    });

    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);

    const container = document.getElementById(containerId);
    if (container) {
      this.term.open(container);
      this.fitAddon.fit();
    } else {
      console.error(`Container with id "${containerId}" not found.`);
    }

    window.addEventListener("resize", () => this.fitAddon.fit());
  }
}

export default TerminalSetup;
export { TerminalSetup };
