FROM node:18-alpine

WORKDIR /app

# Copy the prebuilt standalone files
COPY ./standalone_dist ./

EXPOSE 3000

# Start the Next.js server directly
CMD ["node", "server.js"]
