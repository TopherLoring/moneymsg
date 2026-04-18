with open('src/infrastructure/db/index.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'const pool = new Pool({\n  connectionString: env.DATABASE_URL,\n  max: 10,\n  ssl: buildSslConfig(),\n});',
    '''const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  ssl: env.DB_SSL_MODE === "disable" ? undefined : buildSslConfig(),
});'''
)

with open('src/infrastructure/db/index.ts', 'w') as f:
    f.write(content)
