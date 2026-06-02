const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const registerHandler = require("./api/register.js");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/api/register") {
      await handleApi(req, res);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "method_not_allowed" }));
      return;
    }

    const requestedPath = req.url === "/" ? "/index.html" : req.url;
    const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(ROOT, safePath);

    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    const extension = path.extname(filePath);
    const contentType = MIME_TYPES[extension] || "application/octet-stream";

    fs.readFile(filePath, (error, data) => {
      if (error) {
        if (error.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Not found");
          return;
        }

        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Internal server error");
        return;
      }

      res.writeHead(200, { "Content-Type": contentType });
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      res.end(data);
    });
  } catch (error) {
    console.error("Local dev server error", error);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    }
    res.end("Internal server error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Local dev server running at http://${HOST}:${PORT}`);
});

async function handleApi(req, res) {
  const body = await readJsonBody(req);
  req.body = body;

  res.status = function status(code) {
    res.statusCode = code;
    return res;
  };

  res.json = function json(payload) {
    if (!res.headersSent) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    res.end(JSON.stringify(payload));
    return res;
  };

  await registerHandler(req, res);
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    if (req.method !== "POST" && req.method !== "PUT" && req.method !== "PATCH") {
      resolve({});
      return;
    }

    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        resolve({});
      }
    });
    req.on("error", () => {
      resolve({});
    });
  });
}
