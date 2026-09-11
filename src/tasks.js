import { randomUUID } from "node:crypto";

/**
 * In-memory task store. Kept deliberately simple so the environment has a real
 * end-to-end data flow (create / list / toggle / delete) without external
 * infrastructure such as a database.
 */
export function createTaskStore(seed = []) {
  const tasks = new Map();

  for (const title of seed) {
    const task = makeTask(title);
    tasks.set(task.id, task);
  }

  function makeTask(title) {
    return {
      id: randomUUID(),
      title,
      done: false,
      createdAt: new Date().toISOString(),
    };
  }

  return {
    list() {
      return [...tasks.values()].sort((a, b) =>
        a.createdAt < b.createdAt ? -1 : 1,
      );
    },
    add(title) {
      const trimmed = String(title ?? "").trim();
      if (!trimmed) {
        throw new Error("Task title is required");
      }
      const task = makeTask(trimmed);
      tasks.set(task.id, task);
      return task;
    },
    toggle(id) {
      const task = tasks.get(id);
      if (!task) return null;
      task.done = !task.done;
      return task;
    },
    remove(id) {
      return tasks.delete(id);
    },
    clear() {
      tasks.clear();
    },
  };
}
