const express = require('express');
const passport = require('passport');
const { User, Follow } = require('../models/user');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const passportLocalMongoose = require('passport-local-mongoose');

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function(req, file, cb){
      checkFileType(file, cb);
  }
}).single('image');

// Check file type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
      return cb(null, true);
  } else {
      cb('Error: Images Only!');
  }
}

router.post('/signup', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      return res.status(400).send(err);
    } 
    if (!req.file) {
      return res.status(400).send('Error: No File Selected!');
    }
    
    const { fname, lname, username, twitter, phone_number, github, previous, country, city, skills, email, education_status, employment_status, age, about_me, password, confirm_password } = req.body;
    
    if(password !== confirm_password) {
      return res.status(400).send('Error: Passwords do not match!');
    }

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
      image: req.file.filename,
    });

    User.register(newUser, password, (err, user) => {
      if (err) {
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
  res.render('login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log('Error during login:', err);
      return next(err);
    }
    if (!user) {
      console.log('Authentication failed:', info.message);
      return res.redirect('/authenticate/login?error=' + encodeURIComponent(info.message));
    }
    req.login(user, (err) => {
      if (err) {
        console.log('Error logging in:', err);
        return next(err);
      }
      
      console.log('Login successful');
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
  res.render('signup');
});

router.get("/changepassword", ensureAuthenticated, (req, res) => {
  try {
    
      res.render("changepassword");
    
  } catch (err) {
    console.error("Error in /changepassword route:", err);
    return res.status(500).send("Internal server error");
  }
});
router.post("/changepassword",async (req,res) =>
{
  console.log("In the GET /changepassword route");
    const userid = req.user._id;
    console.log("User ID:", userid);

    const user =User.findById(userid);

      if (!user) {
        console.error("User not found for ID:", userid);
        return res.status(404).send("User not found");
      }
;
 
  const currentpassowrd = req.body.password;
  const new_password = req.body.newpassword;
  const confirm_password = req.body.confirmpassword;
  if(confirm_password != new_password)
  {
    req.flash("the new password and the confirmation password does not match")
    res.redirect("/changepassword")
  }
  const isMatch = await user.comparePassword(currentpassowrd);
  if (!isMatch) {
    // Current password is incorrect
    return res.status(400).render('change-password', { error: 'Current password is incorrect' });
  }
  user.setPassword(new_password);
  

})

module.exports = router;

