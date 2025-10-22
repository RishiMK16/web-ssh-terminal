// backend/server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/status", (req, res) => res.json({ ok: true }));

  // Simple message endpoint
  app.get("/message/:name", (req, res) =>
    res.json({ message: `Hello ${req.params.name}` })
  );

  return app;
}
