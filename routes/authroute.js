const express = require('express');
const passport = require('passport');
const { User, Follow } = require('../models/user');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const passportLocalMongoose = require('passport-local-mongoose');
const flash = require('connect-flash');
const userService = require('../services/userservice');
const bcrypt = require("bcrypt")
// Setup Multer storage
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Signup route
router.post('/signup',async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err);
    }

    const { fname, lname, username, twitter, phone_number, github, previous, country, city, skills, email, education_status, employment_status, age, about_me, password, confirm_password } = req.body;
    
    if (password !== confirm_password) {
      req.flash('error','passwords do not match')
      return res.status(400).send('Error: Passwords do not match!');
    }

   
    const check_email = await User.find({email})
    if (check_email)
    {
      req.flash('error','email already taken')
    }
    // Create user object
    const newUser = new User({
      fname,
      lname,
      username,
      twitter,
      phone_number,
      github,
      previous,
      country,
      city,
      skills,
      email,
      education_status,
      employment_status,
      age,
      about_me,
      image: req.file ? req.file.filename : "noprofile.jpg" 
    });

    User.register(newUser, password, (err, user) => {
      if (err) {
        req.flash('error','error with account creation')
        console.log('Error with account creation:', err);
        return res.redirect('/authenticate/signup');
      }

      req.login(user, (err) => {
        if (err) {
          console.log('Error logging in after registration:', err);
          return res.redirect('/login?error=' + encodeURIComponent(err.message));
        }
        res.redirect('/');
      });
    });
  });
});
router.get('/login', (req, res) => {
  res.render('login', {
    messages: {
      success: req.flash('success') , 
      error: req.flash('error')    
    }
  });
});
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { 
    failureRedirect: '/authenticate/login', 
    failureFlash: true, 
    successRedirect: '/' 
  }, (err, user, info) => {
    if (err) {
      console.error('Error during login:', err);
      req.flash('error', 'An error occurred during login');
      return next(err);
    }
    if (!user) {
      console.log('Authentication failed:', info.message);
      req.flash('error', 'Email or password incorrect');
      return res.redirect('/authenticate/login');
    }
    req.login(user, (err) => {
      if (err) {
        console.error('Error logging in:', err);
        req.flash('error', 'An error occurred during login');
        return next(err);
      }
      
      console.log('Login successful');
      req.flash('success', 'Login successful!');
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

router.get('/signup', (req, res) => {
  res.render('signup', { messages: {
        success: req.flash('success'),
        error: req.flash('error' )}
  })
      });

router.get("/changepassword", ensureAuthenticated, async(req, res) => {
  try {
    const currentuser = await userService.getUserById(req.user._id);
      res.render("changepassword",{currentuser});
    
  } catch (err) {
    console.error("Error in /changepassword route:", err);
    return res.status(500).send("Internal server error");
  }
});


// Route to handle password change
router.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  try {
      // Ensure new passwords match
      if (newPassword !== confirmNewPassword) {
          return res.render('change-password', { messages: { error: 'New passwords do not match' } });
      }

      // Find the user from the session or database
      const user = await User.findById(req.user._id); // Ensure req.user is populated with the logged-in user

      if (!user) {
          return res.render('change-password', { messages: { error: 'User not found' } });
      }

      // Check if the current password is correct
      const isMatch = await bcrypt.compare(currentPassword, user.hash); // Use user.hash to compare

      if (!isMatch) {
        req.flash('Current password is incorrect')
          return res.render('changepassword', { messages: { error: 'Current password is incorrect' } });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the user's password
      user.hash = hashedPassword; // Update with the new hashed password
      await user.save();
        req.flash('succes','Password changed successfully')
      res.render('changepassword', { messages: { success: 'Password changed successfully' } });
  } catch (err) {
      console.error(err);
      res.render('changepassword', { messages: { error: 'An error occurred. Please try again later.' } });
  }
});


router.get('/check-username', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ available: false, message: 'Username is required' });
  }

  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.json({ available: false, message: 'Username is already taken' });
    }
    res.json({ available: true });
  } catch (err) {
    console.error('Error checking username:', err);
    res.status(500).json({ available: false, message: 'Server error' });
  }
});





module.exports = router;
