const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userroutes');
const blogRoutes = require('./routes/blogroutes');
const authRoutes = require('./routes/authroute');
const projectRoutes = require('./routes/projectroute');
const { User } = require('./models/user');
const cors = require('cors');
const Project = require('./models/project');
const Blog= require('./models/blog');
const rateLimit = require('express-rate-limit');
const { ensureAuthenticated } = require('./middleware/authMiddleware');

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/SECOLLAB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .then(async () => {
    await Project.collection.createIndex({ title: 'text' });
    console.log('Text index created on title');
  })
  .then(() => console.log('MongoDB connected'))
  .then(async () => {
    await Blog.collection.createIndex({ title: 'text' });
    console.log('Text index created on title');
  })
  
  
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
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // httpOnly: true, 
    // secure: true 
  }
}));
app.use(passport.initialize());
app.use(passport.session());
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Passport middleware
// Passport middleware


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/* Logging Middleware for Debugging
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   console.log("Session info:", req.session);
//   console.log("User info:", req.user);
//   next();
// });
*/


// Routes
app.use('/', userRoutes);
app.use('/authenticate', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/projects', projectRoutes);











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
