import TerminalSetup from "./terminalSetup.js";
import LoginManager from "./managerComponents/loginManager.js";
import CommandManager from "./managerComponents/commandManager.js";
import InputManager from "./managerComponents/inputManager.js";

const terminalSetup = new TerminalSetup("terminal");

const loginManager = new LoginManager(terminalSetup.term, () => {
  const commandManager = new CommandManager(terminalSetup.term, loginManager);
  const inputManager = new InputManager(terminalSetup.term, loginManager, commandManager);
  inputManager.init();
  commandManager.prompt();
});

// Register input handler first so login input is captured
const commandManager = new CommandManager(terminalSetup.term, loginManager);
const inputManager = new InputManager(terminalSetup.term, loginManager, commandManager);
inputManager.init();

// The LoginManager constructor writes the initial login prompt; no explicit login() method exists.
