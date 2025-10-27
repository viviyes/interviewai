# /opt/interviewai/app/Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Install curl for health checks
RUN apk add --no-cache curl

ENV PORT=8000
EXPOSE 8000
CMD ["node", "server.js"]
