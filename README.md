
Add the following entry into your hosts file:

127.0.0.1   app.mes.ciprecision.com auth.mes.ciprecision.com api.mes.ciprecision.com

This is because it is quite likely that the app, auth and api may be hosted on different servers,
and this is a way of testing for correct CORS functionality.

start in development mode
yarn dev

build the app (for production)
yarn build

start in production mode
yarn prod
