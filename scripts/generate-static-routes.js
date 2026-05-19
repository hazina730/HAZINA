import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const distIndex = resolve("dist/index.html");
const routes = ["about", "channel", "creators", "partners", "contact"];

copyFileSync(distIndex, resolve("dist/404.html"));

for (const route of routes) {
  const routeDir = resolve("dist", route);
  mkdirSync(routeDir, { recursive: true });
  copyFileSync(distIndex, resolve(routeDir, "index.html"));
}
