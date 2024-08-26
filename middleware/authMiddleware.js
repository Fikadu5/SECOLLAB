exports.ensureAuthenticated = (req, res, next) => {
  console.log("Ensuring authentication");
  if (req.isAuthenticated()) {
    console.log("Authenticated");
    return next();
  } else {
    console.log("Not authenticated, redirecting to /login");
    res.redirect('/authenticate/login');
  }
};
