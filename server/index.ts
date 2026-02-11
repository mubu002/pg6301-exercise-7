import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.get("/api/tasks", (c) => {
  return c.json([
    { description: "Create client", completed: true },
    { description: "Fetch from server", completed: true },
    { description: "Deploy to Heroku", completed: false },
  ]);
});

// Serve static files from dist
app.use("*", serveStatic({ root: "../dist" }));

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

serve({
  fetch: app.fetch,
  port,
});
