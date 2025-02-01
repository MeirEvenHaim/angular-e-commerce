# Use a stable Node.js image for Angular development
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire Angular project
COPY . .

# Expose port for Angular
EXPOSE 4200

# Run the Angular app on port 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
