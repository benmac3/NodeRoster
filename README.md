NodeRoster

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
