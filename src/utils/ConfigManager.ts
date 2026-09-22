import * as fs from "fs";
import * as path from "path";

interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiBaseUrl: string;
  timeout: number;
  actionTimeout: number;
  navigationTimeout: number;
  expectTimeout: number;
  retries: number;
}

interface AppConfig {
  environments: Record<string, EnvironmentConfig>;
  defaultEnvironment: string;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;
  private currentEnv: string;

  private constructor() {
    const configPath = this.resolveConfigPath();
    const rawData = fs.readFileSync(configPath, "utf-8");
    this.config = JSON.parse(rawData);
    this.currentEnv =
      process.env.TEST_ENV || this.config.defaultEnvironment || "local";

    // Fail fast on a typo'd TEST_ENV rather than silently falling back, which
    // would run with the wrong timeouts/retries and hide the mistake.
    if (process.env.TEST_ENV && !this.config.environments[process.env.TEST_ENV]) {
      const known = Object.keys(this.config.environments).join(", ");
      throw new Error(
        `Unknown TEST_ENV "${process.env.TEST_ENV}". Known environments: ${known}.`
      );
    }
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  getEnvironment(): EnvironmentConfig {
    const env = this.config.environments[this.currentEnv];
    if (env) {
      return env;
    }
    const defaultEnv = this.config.environments[this.config.defaultEnvironment];
    if (defaultEnv) {
      return defaultEnv;
    }
    return {
      name: "fallback",
      baseUrl: process.env.BASE_URL || "https://qaplayground.com/bank",
      apiBaseUrl: process.env.API_BASE_URL || "https://qaplayground.com/bank/api/v1",
      timeout: 30000,
      actionTimeout: 10000,
      navigationTimeout: 30000,
      expectTimeout: 10000,
      retries: 1,
    };
  }

  getBaseUrl(): string {
    return process.env.BASE_URL || this.getEnvironment().baseUrl;
  }

  getApiBaseUrl(): string {
    return process.env.API_BASE_URL || this.getEnvironment().apiBaseUrl;
  }

  getTimeout(): number {
    return this.getEnvironment().timeout;
  }

  getActionTimeout(): number {
    return this.getEnvironment().actionTimeout;
  }

  getNavigationTimeout(): number {
    return this.getEnvironment().navigationTimeout;
  }

  getExpectTimeout(): number {
    return this.getEnvironment().expectTimeout;
  }

  getRetries(): number {
    return this.getEnvironment().retries;
  }

  getEnvironmentName(): string {
    return this.currentEnv;
  }

  private resolveConfigPath(): string {
    const relative = path.join("tests", "test-data", "environments.json");

    const candidates: string[] = [];

    // Standalone project: all candidates must stay inside THIS project root.
    // 1. From process.cwd() when running `npx playwright test` from /home/abimael/Desktop/light/basics
    candidates.push(path.resolve(process.cwd(), relative));

    // 2. From __dirname (src/utils) — original intent, works regardless of cwd
    const baseDir = this.getBaseDir();
    if (baseDir) {
      candidates.push(path.resolve(baseDir, "../../tests/test-data/environments.json"));
      candidates.push(path.resolve(baseDir, "../../", relative));
      // Upward search capped to project interior (handles dist/src/utils -> project root)
      let dir = baseDir;
      for (let i = 0; i < 4; i++) {
        candidates.push(path.resolve(dir, relative));
        dir = path.resolve(dir, "..");
      }
    }

    // De-duplicate while preserving priority
    const seen = new Set<string>();
    const deduped = candidates.filter((p) => {
      if (seen.has(p)) return false;
      seen.add(p);
      return true;
    });

    for (const p of deduped) {
      if (fs.existsSync(p)) {
        return p;
      }
    }

    // Nothing found — throw with actionable diagnostics (instead of bare ENOENT with cwd-relative path)
    throw new Error(
      `ENOENT: no such file or directory, open '${relative}'. Tried (inside THIS project only):\n` +
        deduped.map((p) => `  - ${p}`).join("\n") +
        `\n cwd=${process.cwd()} baseDir=${baseDir ?? "<none>"}\n` +
        `Fix: run from project root (/home/abimael/Desktop/light/basics) and ensure tests/test-data/environments.json exists.`
    );
  }

  private getBaseDir(): string | null {
    // CommonJS: __dirname is defined (Playwright's loader and ts-node both provide it).
    // In ESM (__dirname unavailable) we fall back to cwd-based candidates in resolveConfigPath().
    if (typeof __dirname !== "undefined" && __dirname) {
      return __dirname;
    }
    return null;
  }
}