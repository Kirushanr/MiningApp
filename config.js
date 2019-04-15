const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('./routes/index');
const googleRoutes=require('./routes/google_route');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const passport= require('passport');

const app = express();
app.use(logger('dev'));


// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//initialize express validator
app.use(expressValidator());

//initialize passport for google authentication
const google = require('./auth/google');
app.use(passport.initialize());


app.use(googleRoutes);
app.use('/api', routes);




module.exports = app;
