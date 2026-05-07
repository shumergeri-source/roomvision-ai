const http = require("http");
const fs = require("fs");
const path = require("path");
const https = require("https");

const PORT = process.env.PORT || 3000;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

function serpApiFetch(params) {
  return new Promise((resolve, reject) => {
    const qs = new URLSearchParams({ ...params, api_key: SERPAPI_KEY }).toString();
    const url = `https://serpapi.com/search.json?${qs}`;
    https.get(url, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error("Failed to parse SerpAPI response"));
        }
      });
    }).on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, `http://localhost:${PORT}`);

  // CORS headers for all responses
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // Serve index.html
  if (parsed.pathname === "/" || parsed.pathname === "/index.html") {
    const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(html);
  }

  // Serve other static files (CSS, JS, images, etc.)
  const staticExts = {
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };
  const ext = path.extname(parsed.pathname).toLowerCase();
  if (staticExts[ext]) {
    const filePath = path.join(__dirname, parsed.pathname);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { "Content-Type": staticExts[ext] });
      return res.end(content);
    }
  }

  // Endpoint 1: Google Shopping search
  if (parsed.pathname === "/api/shopping") {
    const query = parsed.searchParams.get("q");
    if (!query) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing ?q= parameter" }));
    }
    try {
      const data = await serpApiFetch({
        engine: "google_shopping",
        q: query,
        num: 8,
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // Endpoint 2: Immersive product details (direct store links)
  if (parsed.pathname === "/api/product-details") {
    const pageToken = parsed.searchParams.get("page_token");
    if (!pageToken) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing ?page_token= parameter" }));
    }
    try {
      const data = await serpApiFetch({
        engine: "google_immersive_product",
        page_token: pageToken,
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`RoomVision server running at http://localhost:${PORT}`);
});
