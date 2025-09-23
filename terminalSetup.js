export class TerminalSetup {
  constructor(containerId) {
    this.term = new Terminal({
      cursorBlink: true,
      fontSize: 16,
      theme: {
        background: '#1e1e1e',
        foreground: '#00ff00',
        cursor: '#ff0000',
        selection: '#444444'
      }
    });

    this.fitAddon = new FitAddon.FitAddon();
    this.term.loadAddon(this.fitAddon);
    this.term.open(document.getElementById(containerId));
    this.fitAddon.fit();

    window.addEventListener('resize', () => this.fitAddon.fit());
  }
}
