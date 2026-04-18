const fs = require('fs');
let code = fs.readFileSync('src/integrations/tabapay/client.ts', 'utf8');

code = code.replace(/<<<<<<< HEAD\n=======\nimport \{ ProviderError, AppError \} from "\.\.\/\.\.\/shared\/errors";\n>>>>>>> origin\/main\n/s, '');

fs.writeFileSync('src/integrations/tabapay/client.ts', code);
