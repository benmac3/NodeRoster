FROM mysql

MAINTAINER Ben Macfarlane <benmac3@yahoo.com>

# This creates the table structure and seed data:
#   -- it is only executed if the docker container is being run for the
#   first time and no existing database exists
#  see https://hub.docker.com/_/mysql/ (under Initializing a fresh instance)
# This image will be run under docker-compose and that will provide the
# appropriate environment variables for the mysql instance.

COPY roster.sql /docker-entrypoint-initdb.d
