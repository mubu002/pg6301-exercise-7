import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import type { TaskItem } from "../src/shared/TaskItem.ts";
import { MongoClient, ObjectId } from "mongodb";

const app = new Hono();

/* -------------------- MONGODB CONNECTION -------------------- */

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/";

const client = new MongoClient(MONGODB_URL);
const connection = await client.connect();
const taskDb = connection.db("task_application");
const taskCollection = taskDb.collection<TaskItem>("tasks");

/* -------------------- API ROUTES -------------------- */

app.get("/api/tasks", async (c) => {
  const tasks = await taskCollection.find().toArray();
  return c.json(tasks);
});

app.post("/api/tasks", async (c) => {
  const { description, completed } = await c.req.json();

  const task: TaskItem = {
    description,
    completed: completed ?? false,
  };

  await taskCollection.insertOne(task);

  return c.newResponse(null, 201);
});

app.put("/api/tasks/:id", async (c) => {
  const id = c.req.param("id");
  const { completed } = await c.req.json();

  const result = await taskCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { completed } },
  );

  if (result.matchedCount === 0) {
    return c.newResponse("Not found", 404);
  }

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
