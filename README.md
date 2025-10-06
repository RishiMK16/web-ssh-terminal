# 🖥️ Web SSH Terminal

A web-based SSH terminal built with React (frontend) and Node.js (backend), allowing users to access a Linux terminal directly in the browser. This project demonstrates real-time terminal emulation using WebSockets, xterm.js, and node-pty.

---

## 📚 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [How It Works](#how-it-works)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 🚀 Features

- Interactive terminal in the browser using [xterm.js](https://xtermjs.org/)
- Backend shell emulation via `node-pty`
- Real-time communication using WebSockets
- Cross-platform support: Linux, macOS, and Windows
- Easily extendable to full SSH server connections

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher
- **npm** or **yarn**
- **Git** (to clone the repository)
- **Docker** (optional, for containerization)

---

## 🛠️ Installation

Follow these steps to set up the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/RishiMK16/web-ssh-terminal.git
cd web-ssh-terminal
```
## Install Dependencies

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## ▶️ Running the Project

### 1. Start the backend server

```bash
cd backend
node index.js
```

* Backend runs on: `http://localhost:5001`
* WebSocket server also listens on port 5001

### 2. Start the frontend development server

```bash
cd frontend
npm run dev
```

* Vite runs on: `http://localhost:5173`
* Frontend automatically connects to backend WebSocket

### 3. Open the browser

Navigate to: `http://localhost:5173`

You should see an interactive terminal. Try typing commands like:

```bash
ls
pwd
echo Hello
```

---

## 🔍 How It Works

### Frontend (React + xterm.js)

* Captures user input from the browser
* Sends input to backend via WebSocket
* Displays terminal output received from backend

### Backend (Node.js + node-pty)

* Listens for WebSocket messages
* Spawns a pseudo-terminal (bash or PowerShell)
* Sends terminal output back to frontend

### Communication Flow

```
Browser Terminal <-> WebSocket <-> Backend PTY
```

---

## 🔐 Security Notes

* This project is intended for local development and demonstration purposes.

For production use:

* Implement authentication and authorization
* Use HTTPS and secure WebSocket (WSS)
* Sandbox terminal access to prevent command injection
* Avoid exposing unrestricted shell access over the internet
