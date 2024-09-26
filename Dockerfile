# Step 1: Build the app
FROM node:20 as build

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies (including dev dependencies needed for the build)
RUN npm ci

# Copy the rest of the app source code
COPY . .

# Build the React app (this will output the production-ready files in the build folder)
RUN npm run build

# Step 2: Run the app using Node in production mode
FROM node:20

WORKDIR /app

# Copy package.json and package-lock.json from the build stage
COPY --from=build /app/package*.json ./

# Install only production dependencies (this removes dev dependencies)
RUN npm ci --only=production

# Copy the build folder and any other files required for production
COPY --from=build /app/proxy-server ./proxy-server 

# Expose ports (3000 for frontend, 3002 for proxy)
EXPOSE 3000 3002

# Command to run both the frontend and proxy server
CMD ["sh", "-c", "npm start & node /app/proxy-server/proxyServer.js"]
