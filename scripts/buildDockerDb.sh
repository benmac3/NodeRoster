#!/bin/sh
# This script creates an docker image of mysql prepackaged with the database
#   schema and seed data (really trial data - the DB can be initialized empty
#   currently)
# The script requires an accessible MySQL instance to provision as part of this
#   process.  It expects a database named rost with a user/pwd of roster/roster.
#   The docker MySQL container makes it easy to instantiate such a container
#   and an example is in the docker-compose.yml and .env files where a container
#   can be instantiated via externalized environment variables.

#drop the local database to remove any data created by users
echo "Dropping roster database"
node ./scripts/dropDatabase.js

#create and seed a new database
echo "Creating roster database"
node ./scripts/createDatabase.js

echo "Seeding roster database"
node_modules/.bin/sequelize db:seed:all

# dump the new database to a mysql file
# homebrew doesn't seem to create a symbolic link to mysqldump so I added one
# ln -s /usr/local/Cellar/mysql/5.7.15/bin/mysqldump /usr/local/bin/mysqldump
# this will be brittle when it comes to mysql updates
# I'm OK with including the localhost credentials for generating the
# schema and seed data although I could have loaded the environment variables
echo "Creating SQL dump for initialization of the docker image"
mysqldump --user=roster --password=roster roster > db/roster.sql

echo "Creating new database dockerfile image"
cd db
docker build -t benmac/mysql .

cd ..
echo "Removing the mysqldump instance"
rm db/roster.sql
