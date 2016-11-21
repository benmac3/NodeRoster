## NodeRoster

This is a simple CRUD back end using Node/Express/Sequelize/Epilogue designed to serve various flavors of SPA.

It is currently configured to use a MySQL back end with a database named "roster" and a user/password of roster/roster with all privileges on the roster database.

Once the NodeRoster repo is downloaded, run the following to create the database:

node ./scripts/createDatabase.js

(If you need to reinitialize the database run node ./scripts/dropDatabase.js)

To seed the database with data, use:

./node_modules/.bin/sequelize db:seed --seed ./seeders/20161002045650-example.js

Finally, to start node with nodemon to pick up changes, execute:

npm run nodemon

Node should be up and listening on port 9001

The structure of the application follows - http://www.codekitchen.ca/guide-to-structuring-and-building-a-restful-api-using-express-4/

The module strategy was informed by - http://bites.goodeggs.com/posts/export-this/

### Docker variant

The project has also been dockerized so the back end can be stood up anywhere easily in the event only front-end development (React specifically) is being
undertaken.  To build the docker container for the node instance, execute:

docker build -t benmac/node-web-app .

and replace benmac with the preferred name of your container.

To build the persistence layer docker container you must have access to a functional mysql container to populate the schema and seed data.

The docker mysql instance (https://hub.docker.com/_/mysql/) is ideal for this process as the database and users can be created using environment variables
when standing up the container.  Once a MySQL instance is available with a database named roster, to create a Docker database instance run:

./scripts/buildDockerDb.sh

Once the Docker container has been created, docker-compose can then be used to stand up the entire system.

To stand up the entire system, use the following script:

./scripts/refreshDocerInstall.sh

This script takes down any existing docker-compose application, deletes the database directory and stands up a new docker-compose application.  The
MySQL container looks to see if a populated database is present and if not, it creates one and executes any .sh or .sql file in the /docker-entrypoint-initdb.d directory of the MySQL container.

The proprietary Rostering service is not publicly available so the :engine section must be removed from the docker-compose file, along with the :engine dependency in the :node :dependson section.
