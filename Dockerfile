# Stage 1: Build
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application source code
COPY . .

# Build the application (if applicable)
RUN npm run build

# Stage 2: Production
FROM build AS production

# Set working directory
WORKDIR /app

# Copy only the built app and production dependencies
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Expose the application port
EXPOSE 5000

# Run the application
CMD ["node", "dist/index.js"]
