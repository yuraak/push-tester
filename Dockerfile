# Step 1: Build the app
FROM node:20 as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app source code
COPY . .

# Build the React app
RUN npm run build

# Step 2: Run the app using Node
FROM node:20

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src 
COPY --from=build /app/proxy-server ./proxy-server 

# Install production dependencies
RUN npm ci --only=production

# Expose ports (3000 for frontend, 3002 for proxy)
EXPOSE 3000 3002

# Command to run both the frontend and proxy server
CMD ["sh", "-c", "npm start & node /app/proxy-server/proxyServer.js"]
