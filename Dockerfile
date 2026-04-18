# Use Bun for high performance
FROM oven/bun:latest

WORKDIR /app

# Copy lockfile and package.json
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build the project
RUN bun run build

# Cloud Run injects $PORT. We must bind to 0.0.0.0.
# Adjust 'dist/app/server.js' to match your actual build output filename
CMD ["bun", "run", "dist/app/server.js"]