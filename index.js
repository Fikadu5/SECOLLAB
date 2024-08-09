const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const userRoutes = require('./routes/userroutes');
const authRoutes = require('./routes/authroute');

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/zelalem", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(flash());

// Session middleware
app.use(session({
  secret: process.env.SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

// Passport middleware
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Logging Middleware for Debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Session info:", req.session);
  console.log("User info:", req.user);
  next();
});


// Logging Middleware for Debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Session info:", req.session);
  console.log("User info:", req.user);
  next();
});


// Routes
app.use('/', userRoutes);
app.use('/authenticate', authRoutes);




// Handle 404
app.use((req, res, next) => {
  res.status(404).send('Sorry, page not found');
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

