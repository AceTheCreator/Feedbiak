/* eslint-disable no-console */
// Required Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const connectMongo = require('connect-mongo');
const flash = require('connect-flash');
const session = require('express-session');
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
// Connect session and mongo
const mongoStore = connectMongo(session);
app.use(session({
  secret: 'funny',
  resave: true,
  saveUninitialized: true,
  // eslint-disable-next-line new-cap
  store: new mongoStore({
    mongooseConnection: mongoose.connection,
  }),
}));
// Connect flash-section
app.use(flash());
// Global variables "connect-flash"
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
// Routes
const users = require('./controllers/users');
// Route Middlewares
const auth = require('./middlewares/auth');

// Index Route
app.get('/', (req, res) => {
  res.render('index.handlebars');
});
// Home Route
app.get('/home', auth, (req, res, next) => {
  if (req.session.userId) {
    return res.render('routes/admin.handlebars');
  }
  res.redirect('/login');
  next();
});
// User Routes
app.use(users);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`app now listening to port ${PORT}`);
});
