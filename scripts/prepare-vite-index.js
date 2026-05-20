import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

copyFileSync(resolve("index.source.html"), resolve("index.html"));
