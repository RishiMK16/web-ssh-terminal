export class CommandManager {
  constructor(term) {
    this.term = term;
    this.history = [];
    this.historyIndex = 0;
    this.commands = ['help', 'echo', 'date', 'ls', 'clear', 'cat'];
  }

  prompt() {
    this.term.write('\r\nuser@web:~$ ');
  }

  handleCommand(cmd) {
    switch(cmd) {
      case 'help':
        this.term.writeln("Available commands: help, echo, date, ls, clear, cat");
        break;
      case 'date':
        this.term.writeln(new Date().toString());
        break;
      case 'ls':
        this.term.writeln("file1.txt  file2.txt  folder1/");
        break;
      case 'clear':
        this.term.clear();
        break;
      case 'cat file1.txt':
        this.term.writeln("This is the content of file1.txt");
        break;
      default:
        if(cmd.startsWith('echo ')) this.term.writeln(cmd.slice(5));
        else if(cmd.trim() !== '') this.term.writeln(`Command not found: ${cmd}`);
    }

    if(cmd.trim() !== '') this.history.push(cmd);
    this.historyIndex = this.history.length;
  }

  getHistory(up=true) {
    if(this.history.length === 0) return '';
    if(up) this.historyIndex = Math.max(0, this.historyIndex-1);
    else this.historyIndex = Math.min(this.history.length, this.historyIndex+1);
    return this.history[this.historyIndex] || '';
  }

  autoComplete(input) {
    const matches = this.commands.filter(c => c.startsWith(input));
    return matches.length === 1 ? matches[0] : input;
  }
}
