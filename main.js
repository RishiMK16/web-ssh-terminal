import { TerminalSetup } from './terminalSetup.js';
import { LoginManager } from './managerComponents/loginManager.js';
import { CommandManager } from './managerComponents/commandManager.js';
import { InputManager } from './managerComponents/inputManager.js';

// Initialize terminal
const terminalSetup = new TerminalSetup('terminal');
const term = terminalSetup.term;

// Command manager
const commandManager = new CommandManager(term);

// Login manager
const loginManager = new LoginManager(term, () => {
  commandManager.prompt();
});

// Input manager
const inputManager = new InputManager(term, loginManager, commandManager);
inputManager.init();
