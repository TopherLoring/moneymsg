with open('src/modules/webhooks/http/routes.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'const ok = verifyHmac(raw || "", signature, config.secret, config.encoding);',
    'const ok = verifyHmac(raw || "", signature, config.secret, timestamp);'
)

with open('src/modules/webhooks/http/routes.ts', 'w') as f:
    f.write(content)
