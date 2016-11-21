#!/bin/sh

#if docker-compose is currently running, take it down
docker-compose down

# delete the existing docker volume backing the mysql instance or the
# replacement mysql container won't use the new data store.
echo "Removing the existing MySQL schema and seed file"
docker volume rm roster_db_data

echo "Executing docker compose - initilizing everything"
docker-compose up -d
