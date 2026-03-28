import fs from "node:fs";
import path from "node:path";
import Database from "node:sqlite";

export class JsonStateStore {
  private readonly filePath: string;

  constructor(rootDir: string) {
    this.filePath = path.join(rootDir, "kalshi-state.json");
    fs.mkdirSync(rootDir, { recursive: true });
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(
          {
            killSwitch: false,
            armedMarkets: [],
            armedStrategies: [],
            audit: [],
          },
          null,
          2,
        ),
        "utf8",
      );
    }
  }

  read(): any {
    return JSON.parse(fs.readFileSync(this.filePath, "utf8"));
  }

  write(nextState: any): void {
    fs.writeFileSync(this.filePath, JSON.stringify(nextState, null, 2), "utf8");
  }
}

export function createStateRoot(pluginId = "kalshi-plugin"): string {
  return path.join(process.cwd(), ".kalshi-plugin", pluginId);
}
