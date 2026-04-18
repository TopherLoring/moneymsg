import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const projectRoot = process.cwd();
const scanRoots = ["src", "scripts", "tests"];
const extraFiles = ["package.json", "tsconfig.json", "tsconfig.typecheck.json", "drizzle.config.ts"];
const textExtensions = new Set([".ts", ".js", ".json", ".yml", ".yaml", ".md"]);
const violations: string[] = [];

function walk(dir: string, bucket: string[]): void {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      if (entry === "node_modules" || entry === "dist" || entry === ".git") continue;
      walk(fullPath, bucket);
      continue;
    }
    bucket.push(fullPath);
  }
}

function shouldCheck(filePath: string): boolean {
  for (const ext of textExtensions) {
    if (filePath.endsWith(ext)) return true;
  }
  return false;
}

const files: string[] = [];
for (const root of scanRoots) {
  walk(join(projectRoot, root), files);
}
for (const file of extraFiles) {
  files.push(join(projectRoot, file));
}

for (const file of files) {
  if (!shouldCheck(file)) continue;
  const relativePath = relative(projectRoot, file);
  const source = readFileSync(file, "utf8");

  if (source.includes("\t")) {
    violations.push(`${relativePath}: contains tab characters`);
  }

  const lines = source.split(/\n/);
  lines.forEach((line, index) => {
    if (/[ \t]+$/.test(line)) {
      violations.push(`${relativePath}:${index + 1}: trailing whitespace`);
    }
  });

  if (!source.endsWith("\n")) {
    violations.push(`${relativePath}: missing trailing newline`);
  }

  if ((relativePath.startsWith("src/") || relativePath.startsWith("tests/")) && source.includes("console.log(")) {
    violations.push(`${relativePath}: console.log is not allowed`);
  }

  if ((relativePath.startsWith("src/") || relativePath.startsWith("tests/")) && source.includes("debugger;")) {
    violations.push(`${relativePath}: debugger statement is not allowed`);
  }
}

if (violations.length > 0) {
  console.error("MoneyMsg lint failed:\n");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(`MoneyMsg lint passed for ${files.length} files.`);
