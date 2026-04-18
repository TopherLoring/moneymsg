import { spawn } from "node:child_process";
import { request } from "node:http";

const port = process.env.PORT ?? "18080";
const healthUrl = `http://127.0.0.1:${port}/health`;
const server = spawn("bun", ["dist/app/server.js"], {
  cwd: process.cwd(),
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: port,
    DISABLE_SWEEPERS: "true"
  }
});

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getHealth(): Promise<number> {
  return new Promise((resolve, reject) => {
    const req = request(healthUrl, (res) => {
      res.resume();
      resolve(res.statusCode ?? 0);
    });
    req.on("error", reject);
    req.end();
  });
}

async function main(): Promise<void> {
  try {
    for (let attempt = 1; attempt <= 20; attempt += 1) {
      if (server.exitCode !== null) {
        throw new Error(`Server exited early with code ${server.exitCode}`);
      }
      try {
        const status = await getHealth();
        if (status === 200) {
          console.log(`Smoke passed via ${healthUrl}`);
          server.kill("SIGTERM");
          return;
        }
      } catch {
        // keep retrying until timeout
      }
      await wait(500);
    }
    throw new Error(`Smoke failed: ${healthUrl} did not return 200 in time.`);
  } catch (error) {
    server.kill("SIGTERM");
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
