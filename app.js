const mongoose = require('mongoose');

// import environmental variables from our variables.env file
const env = require('dotenv').config();

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.DB_HOST,{ useNewUrlParser: true,useCreateIndex: true });

mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.log(error);
});

// import all of our models
require('./models/Assessment');
require('./models/User');

// Start our app!
const app = require('./config');

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

module.exports =app;