class LoginManager {
  constructor(term, onLoginSuccess) {
    this.term = term;
    this.onLoginSuccess = onLoginSuccess;
    this.stage = "username";
    this.usernameInput = "";
    this.input = "";
    this.token = null;

    this.term.writeln("Welcome to Web SSH Terminal!");
    this.term.write("login: ");
  }

  async tryLogin(username, password) {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      this.token = data.token;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async handleInput(e) {
    if (this.token) return false;

    if (e === "\r") {
      if (this.stage === "username") {
        this.usernameInput = this.input;
        this.input = "";
        this.stage = "password";
        this.term.write("\r\npassword: ");
      } else if (this.stage === "password") {
        const success = await this.tryLogin(this.usernameInput, this.input);
        if (success) {
          this.term.writeln("\r\n✅ Login successful!");
          this.input = "";
          this.onLoginSuccess();
        } else {
          this.term.writeln("\r\n❌ Login failed!");
          this.input = "";
          this.stage = "username";
          this.term.write("login: ");
        }
      }
    } else if (e === "\u007F") {
      if (this.input.length > 0) {
        this.input = this.input.slice(0, -1);
        this.term.write("\b \b");
      }
    } else {
      this.input += e;
      if (this.stage === "username") {
        this.term.write(e);
      } else if (this.stage === "password") {
        this.term.write("*");
      }
    }
    return true;
  }
}

export default LoginManager;
export { LoginManager };
