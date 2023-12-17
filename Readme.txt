localhost:3000/doc is the api documentation

Please provide valid email to get email alerts

Run npm test to test program

Run npm start to run program

You must first add favorite before adding alerts

After adding favptite use favorited crypto id to id field in alerts

After signing up for alerts you get alets per every 5 minutes (alert period is 5 minutes because it makes testing easier)

To change alert period you must change value of ALERT_PERIOD in .env file

Connect to localhost:3000 with socket.io and emit 'price_update' to get real time price updates to client side