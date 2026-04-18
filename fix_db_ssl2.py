with open('src/infrastructure/db/index.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'ssl: env.DB_SSL_MODE === "disable" ? undefined : buildSslConfig(),',
    'ssl: env.DB_SSL_MODE === "disable" ? false : buildSslConfig(),'
)

with open('src/infrastructure/db/index.ts', 'w') as f:
    f.write(content)
