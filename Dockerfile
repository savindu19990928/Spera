# Use the official Node.js LTS image
FROM node:18

# Create and set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# App listens on port 8080
EXPOSE 8080
CMD [ "npm", "start" ]
