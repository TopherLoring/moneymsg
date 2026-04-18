import re

with open('src/shared/session.ts', 'r') as f:
    content = f.read()

# Replace issueAccessToken function using regex
pattern = r'/\*\* Issue an access token \*/\nexport function issueAccessToken\(sub: string, role: TokenRole\): string \{\n  return jwt\.sign\(\n    \{ sub, role, type: "access" \} satisfies TokenPayload,\n    env\.JWT_SECRET,\n    \{\n      expiresIn: env\.JWT_ACCESS_TTL_SECONDS,\n      issuer: env\.JWT_ISSUER,\n    \},\n  \);\n\}\n\n'
content = re.sub(pattern, '', content)

with open('src/shared/session.ts', 'w') as f:
    f.write(content)
