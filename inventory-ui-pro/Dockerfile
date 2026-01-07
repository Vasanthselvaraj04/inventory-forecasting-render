# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build React app
RUN npm run build

# ---------- Runtime Stage ----------
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose nginx port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
