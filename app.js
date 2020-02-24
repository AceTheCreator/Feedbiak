/* eslint-disable no-console */
// Required Modules
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const connectMongo = require('connect-mongo');
require('./config/passport');
const passport = require('passport');
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
const dbUser = process.env.dbUsername;
const { dbPassword } = process.env;
const dbURI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0-2ebjr.mongodb.net/feedbiak?retryWrites=true&w=majority`;

mongoose.connect(`mongodb://localhost:${process.env.DBPORT}/feedbiak`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch((err) => {
  console.log(err);
});
mongoose.connection.on('connected', () => {
  console.log('Mongodb connection successful');
});
// set view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));
// Database Model
const boardSchmea = require('./models/Board');
const boardPost = require('./models/BoardPost');

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
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
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
const boards = require('./controllers/boards');
const posts = require('./controllers/boardPost');
const invite = require('./controllers/email');
const guest = require('./controllers/guestUser');
// Route Middlewares
const auth = require('./middlewares/auth');
const redirectIfAuth = require('./middlewares/redirectIfAuth');

// Index Route
app.get('/', redirectIfAuth, (req, res) => {
  res.render('index.handlebars');
});

// Admin Home Route

app.get('/admin', auth, (req, res, next) => {
  let admin;
  const planned = [];
  const inProgress = [];
  const completed = [];
  if (req.session.userId) {
    admin = 'T';
    return boardSchmea.find({ boardOwner: req.session.userId })
      .sort({ date: 'desc' })
      // eslint-disable-next-line no-shadow
      .then((boards) => {
        boardPost.find({
          boardOwner: req.session.guestId || req.session.userId,
        }).then((status) => {
          for (let i = 0; i < status.length; i++) {
            if (status[i].status === 'Planned') {
              planned.push(status[i]);
            } else if (status[i].status === 'In Progress') {
              inProgress.push(status[i]);
            } else if (status[i].status === 'Completed') {
              completed.push(status[i]);
            }
          }
          res.render('routes/admin', {
            boards,
            admin,
            planned,
            inProgress,
            completed,
          });
        });
      });
  }
  res.redirect('/login');
  next();
});
// User Routes
app.use(users);
// Boards Routes
app.use(boards);
// Board Post Routes;
app.use(posts);
// Email ivitation routes
app.use(invite);
// Guest Routes
app.use(guest);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`app now listening to port ${PORT}`);
});
