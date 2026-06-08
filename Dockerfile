FROM node:18-alpine

WORKDIR /app

# Cache prisma installation so it doesn't download on every code deploy
RUN npm install -g prisma --legacy-peer-deps

# Copy the prebuilt standalone files
COPY ./standalone_dist ./

EXPOSE 3000

# Push schema changes and start the Next.js server
CMD ["sh", "-c", "prisma db push --schema=prisma/schema.prisma --accept-data-loss && node server.js"]
