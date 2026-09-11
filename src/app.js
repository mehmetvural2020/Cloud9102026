import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createTaskStore } from "./tasks.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp(store = createTaskStore(["Welcome to Cloud9102026"])) {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/api/tasks", (_req, res) => {
    res.json({ tasks: store.list() });
  });

  app.post("/api/tasks", (req, res) => {
    try {
      const task = store.add(req.body?.title);
      res.status(201).json({ task });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch("/api/tasks/:id", (req, res) => {
    const task = store.toggle(req.params.id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json({ task });
  });

  app.delete("/api/tasks/:id", (req, res) => {
    const removed = store.remove(req.params.id);
    if (!removed) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.status(204).end();
  });

  app.use(express.static(path.join(__dirname, "..", "public")));

  return app;
}
