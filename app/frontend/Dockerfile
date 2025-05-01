# Use Node.js for building the frontend
FROM node:20-alpine as build

WORKDIR /app/frontend

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Use nginx to serve the build
FROM nginx:alpine
COPY --from=build /app/frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]