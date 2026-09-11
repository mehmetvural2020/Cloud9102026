import { test, describe } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "./app.js";
import { createTaskStore } from "./tasks.js";

function appWithEmptyStore() {
  return createApp(createTaskStore([]));
}

describe("Task API", () => {
  test("health endpoint reports ok", async () => {
    const res = await request(appWithEmptyStore()).get("/api/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "ok");
  });

  test("starts with an empty task list", async () => {
    const res = await request(appWithEmptyStore()).get("/api/tasks");
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.tasks, []);
  });

  test("creates a task", async () => {
    const app = appWithEmptyStore();
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Write the report" });
    assert.equal(res.status, 201);
    assert.equal(res.body.task.title, "Write the report");
    assert.equal(res.body.task.done, false);

    const list = await request(app).get("/api/tasks");
    assert.equal(list.body.tasks.length, 1);
  });

  test("rejects an empty title", async () => {
    const res = await request(appWithEmptyStore())
      .post("/api/tasks")
      .send({ title: "   " });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /required/i);
  });

  test("toggles a task done state", async () => {
    const app = appWithEmptyStore();
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Toggle me" });
    const { id } = created.body.task;

    const toggled = await request(app).patch(`/api/tasks/${id}`);
    assert.equal(toggled.status, 200);
    assert.equal(toggled.body.task.done, true);
  });

  test("deletes a task", async () => {
    const app = appWithEmptyStore();
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Delete me" });
    const { id } = created.body.task;

    const del = await request(app).delete(`/api/tasks/${id}`);
    assert.equal(del.status, 204);

    const list = await request(app).get("/api/tasks");
    assert.equal(list.body.tasks.length, 0);
  });

  test("returns 404 for unknown task", async () => {
    const res = await request(appWithEmptyStore()).patch("/api/tasks/does-not-exist");
    assert.equal(res.status, 404);
  });
});
