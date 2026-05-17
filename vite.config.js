import path from "path"
import { dirname } from "path"
import { fileURLToPath } from "url"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

const __dirname = dirname(fileURLToPath(import.meta.url))

function localApiProxy() {
  return {
    name: "local-api-proxy",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";
        if (!url.startsWith("/api/")) return next();

        const modulePath = url.split("?")[0].replace("/api/", "");

        try {
          // Read body for POST requests
          let body = {};
          if (req.method === "POST" || req.method === "PUT") {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const raw = Buffer.concat(chunks).toString();
            try { body = JSON.parse(raw); } catch { body = {}; }
          }
          req.body = body;

          // Add res helpers that Vercel provides
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          const originalEnd = res.end.bind(res);
          res.json = (data) => {
            res.setHeader("Content-Type", "application/json");
            originalEnd(JSON.stringify(data));
          };

          // Import and call handler
          const handlerModule = await import(`./api/${modulePath}.js`);
          await handlerModule.default(req, res);
        } catch (error) {
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: error.message || "Internal server error" }));
          }
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [localApiProxy(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
