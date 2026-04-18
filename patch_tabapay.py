with open('src/integrations/tabapay/client.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'import { ProviderError } from "../../shared/errors";',
    'import { AppError, ProviderError } from "../../shared/errors";'
)

with open('src/integrations/tabapay/client.ts', 'w') as f:
    f.write(content)
