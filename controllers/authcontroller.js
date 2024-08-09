const { validatePasswords } = require('../utils/passwordUtils');
const { createAndRegister } = require('../services/authervice');

exports.renderSignupPage = async (req, res) => {
    res.render('signup');
};
exports.handleSignup = async (req, res) => {
  const userDetails = req.body;
  console.log(userDetails); // Log the request body

  try {
      // Validate passwords
      // await validatePasswords(userDetails.password, userDetails.confirm_password);

      // Create and register the user
      const user = await createAndRegister(userDetails);
      console.log(user);

      // Display a success message or redirect to a dedicated registration page
      req.flash('success', 'You have registered successfully.');
      res.redirect('/');
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(400).render('signup', { error: error.message });
  }
};

