ARG NODE_ENV  # Define build argument for NODE_ENV

FROM node:21
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Set NODE_ENV based on build argument
ENV NODE_ENV='production'

EXPOSE 8882

# Default command (can be overridden at runtime)
CMD [ "node", "src/index.js" ]