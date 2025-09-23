export class LoginManager {
  constructor(term, onLoginSuccess) {
    this.term = term;
    this.onLoginSuccess = onLoginSuccess;

    this.user = 'user';
    this.pass = '1234';
    this.stage = 'username';
    this.usernameInput = '';
    this.input = '';
    this.loggedIn = false;

    this.term.writeln("Welcome to Web SSH Terminal!");
    this.term.write("login: ");
  }

  handleInput(e) {
    if (this.loggedIn) return false;

    if (e === '\r') {
      if (this.stage === 'username') {
        this.usernameInput = this.input;
        this.input = '';
        this.stage = 'password';
        this.term.write('\r\npassword: ');
      } else if (this.stage === 'password') {
        if (this.usernameInput === this.user && this.input === this.pass) {
          this.loggedIn = true;
          this.term.writeln("\r\nLogin successful!");
          this.input = '';
          this.onLoginSuccess();
        } else {
          this.term.writeln("\r\nLogin failed!");
          this.input = '';
          this.stage = 'username';
          this.term.write("login: ");
        }
      }
    } else if (e === '\u007F') {
      if (this.input.length > 0) {
        this.input = this.input.slice(0, -1);
        this.term.write('\b \b');
      }
    } else {
      this.input += e;
      if (this.stage === 'username') this.term.write(e);
      else if (this.stage === 'password') this.term.write('*');
    }

    return true; // handled by login
  }
}
