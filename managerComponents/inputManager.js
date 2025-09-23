export class InputManager {
  constructor(term, loginManager, commandManager) {
    this.term = term;
    this.loginManager = loginManager;
    this.commandManager = commandManager;
    this.input = '';
  }

  init() {
    this.term.onData(e => {
      // First, check login
      if(this.loginManager.handleInput(e)) return;

      const code = e.charCodeAt(0);

      if(code === 13) { // Enter
        this.commandManager.handleCommand(this.input);
        this.input = '';
        this.commandManager.prompt();
      } else if(code === 127) { // Backspace
        if(this.input.length > 0) {
          this.input = this.input.slice(0, -1);
          this.term.write('\b \b');
        }
      } else if(code === 9) { // Tab
        this.input = this.commandManager.autoComplete(this.input);
        this.term.write('\r\b' + this.input);
      } else {
        this.input += e;
        this.term.write(e);
      }
    });

    this.term.onKey(e => {
      if(!this.loginManager.loggedIn) return;
      const key = e.domEvent.key;
      if(key === 'ArrowUp') {
        const hist = this.commandManager.getHistory(true);
        this._replaceInput(hist);
      } else if(key === 'ArrowDown') {
        const hist = this.commandManager.getHistory(false);
        this._replaceInput(hist);
      }
    });
  }

  _replaceInput(newInput) {
    while(this.input.length) {
      this.term.write('\b \b');
      this.input = this.input.slice(0, -1);
    }
    this.input = newInput;
    this.term.write(this.input);
  }
}
