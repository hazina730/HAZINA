import { copyFileSync, cpSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const routes = ["about", "channel", "creators", "partners", "contact"];

copyFileSync(resolve("dist/index.html"), resolve("index.html"));
copyFileSync(resolve("dist/404.html"), resolve("404.html"));
copyFileSync(resolve("dist/favicon.svg"), resolve("favicon.svg"));
copyFileSync(resolve("dist/og-hazina-placeholder.svg"), resolve("og-hazina-placeholder.svg"));
copyFileSync(resolve("dist/robots.txt"), resolve("robots.txt"));
copyFileSync(resolve("dist/sitemap.xml"), resolve("sitemap.xml"));

rmSync(resolve("assets"), { recursive: true, force: true });
cpSync(resolve("dist/assets"), resolve("assets"), { recursive: true });

for (const route of routes) {
  rmSync(resolve(route), { recursive: true, force: true });
  mkdirSync(resolve(route), { recursive: true });
  copyFileSync(resolve("dist", route, "index.html"), resolve(route, "index.html"));
}
