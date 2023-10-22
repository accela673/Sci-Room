FROM node:16.16.0-alpine

# Create a working directory for your app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json tsconfig*.json nest*.json /app/

RUN ls -l

# Install app dependencies
RUN npm i

RUN ls -l

# RUN yarn --frozen-lockfile

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Define the command to start your Node.js application
CMD ["npm", "run", "start:dev"]
