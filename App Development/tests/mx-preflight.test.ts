import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8")) as {
  scripts: Record<string, string>;
  packageManager?: string;
};
const repoRoot = join(projectRoot, "..");
const rootGitignore = readFileSync(join(repoRoot, ".gitignore"), "utf8");
const ciWorkflow = readFileSync(join(projectRoot, ".github", "workflows", "ci.yml"), "utf8");

describe("MX preflight repo guards", () => {
  test("Bun is declared as the preferred package manager", () => {
    expect(packageJson.packageManager).toBe("bun@1.3.12");
  });

  test("required preflight scripts exist", () => {
    expect(packageJson.scripts.lint).toBeDefined();
    expect(packageJson.scripts.typecheck).toBeDefined();
    expect(packageJson.scripts.test).toBeDefined();
    expect(packageJson.scripts.build).toBeDefined();
    expect(packageJson.scripts["db:check"]).toBeDefined();
    expect(packageJson.scripts.smoke).toBeDefined();
    expect(packageJson.scripts.ci).toBeDefined();
  });

  test("root gitignore blocks dependency and build output drift", () => {
    expect(rootGitignore).toContain("node_modules/");
    expect(rootGitignore).toContain("**/node_modules/");
    expect(rootGitignore).toContain("dist/");
    expect(rootGitignore).toContain("**/dist/");
    expect(rootGitignore).toContain("build/");
  });

  test("Bun lockfile exists and npm lockfile is absent", () => {
    expect(existsSync(join(projectRoot, "bun.lock"))).toBe(true);
    expect(existsSync(join(projectRoot, "package-lock.json"))).toBe(false);
  });

  test("CI workflow is Bun-first", () => {
    expect(ciWorkflow).toContain("oven-sh/setup-bun@v2");
    expect(ciWorkflow).toContain("bun install --frozen-lockfile");
    expect(ciWorkflow).toContain("bun run lint");
    expect(ciWorkflow).toContain("bun run typecheck");
    expect(ciWorkflow).toContain("bun test");
    expect(ciWorkflow).toContain("bun run build");
    expect(ciWorkflow).toContain("bun run db:check");
    expect(ciWorkflow).toContain("bun run smoke");
  });
});
