import Fastify from "fastify";
import { transferRoutes } from "./routes/transfer";
import { plaidRoutes } from "./routes/plaid";
import { walletRoutes } from "./routes/wallet";
import { kycRoutes } from "./routes/kyc";
import { webhookRoutes } from "./routes/webhooks";
import { requestRoutes } from "./routes/request";
import { statusRoutes } from "./routes/status";
import { port } from "./lib/env";

const app = Fastify({ logger: true });

app.register(plaidRoutes);
app.register(kycRoutes);
app.register(walletRoutes);
app.register(transferRoutes);
app.register(requestRoutes);
app.register(statusRoutes);
app.register(webhookRoutes);

app.get("/health", async () => ({ ok: true }));

app.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});
