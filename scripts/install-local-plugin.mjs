#!/usr/bin/env node
/**
 * Cross-platform local install: build kalshi-plugin, copy into OpenClaw extensions, npm install, inspect.
 *
 * Overrides:
 *   KALSHI_REPO_ROOT       - path to kalshi-openclaw repo root (default: parent of scripts/)
 *   KALSHI_EXTENSION_ROOT  - destination extension folder (default: ~/.openclaw/extensions/kalshi-plugin)
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repoRoot = process.env.KALSHI_REPO_ROOT
  ? path.resolve(process.env.KALSHI_REPO_ROOT)
  : path.resolve(__dirname, "..");

const extensionRoot = process.env.KALSHI_EXTENSION_ROOT
  ? path.resolve(process.env.KALSHI_EXTENSION_ROOT)
  : path.join(os.homedir(), ".openclaw", "extensions", "kalshi-plugin");

const pluginSrc = path.join(repoRoot, "packages", "kalshi-plugin");

function run(cmd, args, cwd) {
  const shell = process.platform === "win32";
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", shell });
  if (r.error) throw r.error;
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function copyPluginContents(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    const from = path.join(srcDir, name);
    const to = path.join(destDir, name);
    fs.cpSync(from, to, { recursive: true });
  }
}

console.log("Building plugin...");
run("npm", ["install", "--package-lock-only", "--ignore-scripts", "--no-audit", "--no-fund"], repoRoot);
run("npx", ["tsc", "-p", "packages/kalshi-plugin/tsconfig.json"], repoRoot);

console.log("Syncing plugin files to extension root...");
fs.rmSync(extensionRoot, { recursive: true, force: true });
copyPluginContents(pluginSrc, extensionRoot);

console.log("Installing extension runtime dependencies...");
run("npm", ["install", "--no-audit", "--no-fund"], extensionRoot);

console.log("Inspecting plugin...");
run("openclaw", ["plugins", "inspect", "kalshi-plugin", "--json"], extensionRoot);

console.log("Done.");
