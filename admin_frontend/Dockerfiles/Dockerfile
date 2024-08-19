# Stage 1: Build the React application
FROM node:14 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to work directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

COPY .env .env.production

# Argument to specify the environment (default is `local`)
ARG ENV=production

# Ensure no .env files are present
#RUN rm -f .env

# Optionally, you can list the directory contents for debugging purposes
#RUN ls -la

# Use a shell command to conditionally copy the correct .env file
# If ENV is production, use .env.production, otherwise use the respective .env file
#RUN if [ "$ENV" = "production" ]; then cp -f .env.production .env.local; else cp -f .env .env.local; fi
RUN cp -f .env .env.production

# Build the application
RUN npm run build

# Stage 2: Serve the application with NGINX
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy NGINX configuration file
#COPY nginx.conf /etc/nginx/nginx.conf

# Copy the nginx configuration (if you have one)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
