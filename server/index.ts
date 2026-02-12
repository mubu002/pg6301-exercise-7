import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import type { TaskItem } from "../src/shared/TaskItem.ts";
import { MongoClient } from "mongodb";

const app = new Hono();

/* -------------------- MONGODB CONNECTION -------------------- */

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/";

const client = new MongoClient(MONGODB_URL);
const connection = await client.connect();
const taskDb = connection.db("task_application");

/* -------------------- TEMP ARRAY (fortsatt i bruk) -------------------- */

const tasks: TaskItem[] = [
  { description: "Create client", completed: true },
  { description: "Fetch from server", completed: true },
  { description: "Deploy to Heroku", completed: false },
];

/* -------------------- API ROUTES -------------------- */

app.get("/api/tasks", (c) => {
  return c.json(tasks);
});

app.post("/api/tasks", async (c) => {
  const task = await c.req.json();

  const newTask: TaskItem = {
    description: task.description,
    completed: task.completed ?? false,
  };

  tasks.push(newTask);

  return c.newResponse(null, 201);
});

app.put("/api/tasks/:index", async (c) => {
  const index = parseInt(c.req.param("index"));
  const { completed } = await c.req.json();

  if (!tasks[index]) {
    return c.newResponse("Not found", 404);
  }

  tasks[index].completed = completed;

  return c.newResponse(null, 204);
});

/* -------------------- STATIC FILES -------------------- */

app.use("/*", serveStatic({ root: "../dist" }));
app.get("*", serveStatic({ path: "../dist/index.html" }));

/* -------------------- START SERVER -------------------- */

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

serve({
  fetch: app.fetch,
  port,
});
