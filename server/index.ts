import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

app.get("/api/tasks", (c) => {
  return c.json([
    { description: "Create client", completed: true },
    { description: "Fetch from server", completed: true },
    { description: "Deploy to Heroku", completed: false },
  ]);
});

serve({
  fetch: app.fetch,
  port: 3000,
});
