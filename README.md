NodeRoster

This is a simple CRUD back end using Node/Express/Sequelize/Epilogue designed to serve various flavors of SPA.

It is currently configured to use a MySQL back end with a database named "roster" and a user/password of roster/roster with all privileges on the roster database.

Once the NodeRoster repo is downloaded, run the following to create the database:

node ./scripts/createDatabase.js

(If you need to reinitialize the database run node ./scripts/dropDatabase.js)

To seed the database with data, use:

./node_modules/.bin/sequelize db:seed --seed ./seeders/20161002045650-example.js

Finally, to start node, execute:

node src/server

Node should be up and listening on port 9001
