# Use the official MySQL image as the base
FROM mysql:8.0

# Environment variables to configure MySQL
ENV MYSQL_DATABASE=studio_ghibli_edu \
    MYSQL_ROOT_PASSWORD=sg@group1

# Add the content of the SQL script to the image
ADD database.sql /docker-entrypoint-initdb.d

# When the container starts, MySQL will execute scripts in /docker-entrypoint-initdb.d/
