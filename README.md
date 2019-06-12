Going to follow [this tutorial from MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website) for getting the express app started and then add some additional features for our leaflet map and postgis routes.

1. `npm install -g express-generator`
2. `express leaflet-express-tutorial --view=pug`, and follow instructions to install and run
3. install nodemon `npm install -g nodemon`
4. add `devstart` to package.json
5. load and test app
6. make a new route for `streetcars`
7. add a map (http://duspviz.mit.edu/web-map-workshop/leaflet_nodejs_postgis/)
8. connect map to API and draw features!

## DB
- using Heroku built in DB
- connect with DATABASE_URL
- refer to `db_setup.sql` for basic setup info

## Deploy
We are going to add the app as a Heroku app [following these instructions](https://devcenter.heroku.com/articles/git)
1. Install Heroku CLI and get Heroku account
2. Go into express app directory and `heroku login` from commandline