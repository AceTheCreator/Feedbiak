/* eslint-disable no-console */
// Required Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Initializations
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
// Mongodb connection
mongoose.connect('mongodb://localhost:27017/feedbiak', { useMongoClient: true });
// set view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
// set static folder
app.use('/public/', express.static(path.join(__dirname, 'public')));
// Method override middleware
app.use(methodOverride('_method'));

// Routes
const users = require('./controllers/users');

// Use Routes
app.use(users);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`app now listening to port ${PORT}`);
});
