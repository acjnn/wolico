FROM node:18
LABEL authors="AcjnN"

# Set working dir in the container
WORKDIR /usr/src/app

# Copy package.json and package to leverage Docker cache
COPY package*.json ./

# Install packages
RUN npm install

# Bundle app's source code in Docker image
COPY . .

# Make port available
EXPOSE 3000

# Define environment variables
ENV APP_PORT 3000
ENV POSTGRES_URI postgresql://admin:wolico@postgres-wolico:5432/wolico
ENV JWT_SECRET 023G7tg2N3fh0SGavlHRn209q3Z

# Run app
CMD ["npm", "start"]

