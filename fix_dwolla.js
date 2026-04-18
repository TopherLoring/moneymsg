const fs = require('fs');
let code = fs.readFileSync('src/integrations/dwolla/client.ts', 'utf8');

code = code.replace(/<<<<<<< HEAD\n  const correlationId = getRequestContext\(\)\?\.requestId;\n=======\n  const authHeader = `Basic \$\{Buffer\.from\(`\$\{env\.DWOLLA_APP_KEY\}:\$\{env\.DWOLLA_APP_SECRET\}`\)\.toString\("base64"\)\}`;(?:.*?)\n  const correlationId = getCorrelationMeta\(\)\.requestId;\n>>>>>>> origin\/main/s,
`  const authHeader = \`Basic \${Buffer.from(\`\${env.DWOLLA_APP_KEY}:\${env.DWOLLA_APP_SECRET}\`).toString("base64")}\`;
  const correlationId = getRequestContext()?.requestId;`);

fs.writeFileSync('src/integrations/dwolla/client.ts', code);
