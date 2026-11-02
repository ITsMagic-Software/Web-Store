import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { resolve, relative, isAbsolute, extname } from "node:path";

const root = resolve("out");
if (!existsSync(resolve(root, "index.html"))) throw new Error("Run npm run build before npm start");
const portIndex = process.argv.indexOf("--port");
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT ?? 3000);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".woff2": "font/woff2", ".svg": "image/svg+xml" };

createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") { response.writeHead(405).end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
  catch { response.writeHead(400).end(); return; }
  if (pathname === "/") { response.writeHead(302, { Location: "/store/" }).end(); return; }
  if (pathname !== "/store" && !pathname.startsWith("/store/")) { response.writeHead(404).end(); return; }
  const local = pathname.slice("/store".length);
  let target = resolve(root, `.${local || "/"}`);
  const offset = relative(root, target);
  if (offset.startsWith("..") || isAbsolute(offset) || local.includes("\\") || local.includes(":")) { response.writeHead(403).end(); return; }
  if (existsSync(target) && statSync(target).isDirectory()) {
    if (!pathname.endsWith("/")) { response.writeHead(308, { Location: `${pathname}/${new URL(request.url, "http://localhost").search}` }).end(); return; }
    target = resolve(target, "index.html");
  }
  const found = existsSync(target) && statSync(target).isFile();
  if (!found) target = resolve(root, "404.html");
  response.writeHead(found ? 200 : 404, { "Content-Type": types[extname(target)] ?? "application/octet-stream", "X-Content-Type-Options": "nosniff" });
  if (request.method === "HEAD") response.end();
  else createReadStream(target).on("error", () => response.destroy()).pipe(response);
}).listen(port, "127.0.0.1", () => process.stdout.write(`Store preview: http://127.0.0.1:${port}/store/\n`));
