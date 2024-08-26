const projectservice = require("../services/projectservice");
const flash = require('connect-flash');
const userService = require('../services/userservice');
const xss = require('xss');







// This function handles the acceptance of interest in a project
exports.acceptinterest = async (req, res) => {
  console.log("accepted request");

  // Extract the userId and projectId from the request parameters
  const userId = xss(req.params.userid);
  const projectid = xss(req.params.projectid);

  // Call the acceptinterest function from the projectservice to handle the acceptance of interest
  const result = await projectservice.acceptinterest(projectid, userId);

  // If the operation was successful, send a success response
  if (result) {
    res.status(200).json({ message: 'added to the team' });
  } 
  // If there was an error, send a 500 Internal Server Error response
  else {
    res.status(500).send('Internal Server Error');
  }
};

// This function handles the rendering of the 'addproject' page
exports.newproject = async(req,res) => {
  // Fetch the tags from the projectservice
  const tags = await projectservice.gettags();

  // Get the current user's information
  const currentuser = await userService.getUserById(req.user._id);

  // Render the 'addproject' page, passing the tags, current user, and any success/error messages
  res.render('addproject', {
    tags,
    messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },
    currentuser
  });
};

// This function handles the creation of a new project
exports.createProject = async (req, res) => {
  // Extract the checked options from the request body
  const checkedOptions = req.body.myCheckboxes || [];

  // Extract the project details from the request body
  const projectDetails = req.body;

  try {
    // Create the project using the projectservice
    await projectservice.createProject(projectDetails, req.user._id, checkedOptions);

    // Redirect the user to the 'myprojects' page
    res.redirect('/projects/myprojects');
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response
    console.error('Error creating project:', error);
    res.status(500).send('Internal Server Error');
  }
};

// This function handles the rendering of the 'projectcatagories' page
exports.getcatagories = async(req,res) => {
  // Fetch the tags from the projectservice
  const tags = await projectservice.gettags();

  // Get the current user's information
  const currentuser = await userService.getUserById(req.user._id);

  // Render the 'projectcatagories' page, passing the tags, current user, and any success/error messages
  res.render("projectcatagories", {
    tags,
    currentuser,
    messages: {
      success: req.flash('success'),
      error: req.flash('error')
    }
  });
};

// This function handles the search for projects
exports.getsearchresult = async(req,res) => {
  // Extract the search query from the request parameters
  const query = req.params.text;

  // Search for projects using the projectservice
  const projects = await projectservice.searchProjects(query);

  // Get the current user's information
  const currentuser = await userService.getUserById(req.user._id);

  // Render the 'project' page, passing the search results, current user, and any success/error messages
  res.render("project", {
    projects,
    currentuser,
    messages: {
      success: req.flash('success'),
      error: req.flash('error')
    }
  });
};

// This function handles the rendering of the 'project' page
exports.getProjects = async(req,res) => {
  // Fetch the projects for the current user using the projectservice
  const projects = await projectservice.getProjects(req.user._id);

  // Get the current user's information
  const currentuser = await userService.getUserById(req.user._id);

  // Render the 'project' page, passing the projects, current user, and any success/error messages
  res.render("project", {
    projects,
    messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },
    currentuser
  });
};

// This function handles the rendering of the 'myproject' page
exports.getMyProjects = async(req,res) => {
  // Get the current user's ID
  const id = req.user._id;

  // Fetch the user's projects using the projectservice
  const project = await projectservice.getMyProject(id);

  // Get the current user's information
  const currentuser = await userService.getUserById(req.user._id);

  // Render the 'myproject' page, passing the user's projects, current user, and any success/error messages
  res.render("myproject", {
    project,
    messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },
    currentuser
  });
};

// Controller function to get a user's collaborations
exports.getmycollabration = async(req,res) => {
  const id = req.user._id;
  const projects = await projectservice.getcollabration(id)
  const currentuser = await  userService.getUserById(req.user._id);

  res.render("mycollabration",{
      projects,
     messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },currentuser })
}

// Controller function to render the search project page
exports.searchProjects = async(req,res) => {
  res.render("searchproject")
}

// Controller function to handle the search results
exports.searchResults = async(req,res) => {
  res.render("")
}

// Controller function to get a specific project by its ID
exports.getProjectById = async(req,res) => {
  const project = await projectservice.getProjectById(req.params.id);
  const currentuser =  userService.getUserById(req.user._id);

  res.render("specficproject",{
      project,
      messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },currentuser })
}

// Controller function to get all projects
exports.getProjects = async(req,res) => {
  const projects = await projectservice.getProjects();
  const currentuser =  userService.getUserById(req.user._id);

  res.render("project",{projects,
      messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },currentuser
  })
}

// Controller function to get a user's specific project by its ID
exports.getmyprojectwithid = async(req,res) => {
  const project = await projectservice.getMyProjectbyid(req.params.id);
  const currentuser =  userService.getUserById(req.user._id);

 res.render("interestinmyproject",{project,
      messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },currentuser
 })
}

// Controller function to get a user's projects with pagination
exports.getUserProjects = async (req, res) => {
try {
  const userId = req.params.id;
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified

  // Fetch the paginated projects from the service
  const { projects, currentPage, totalPages, limit: pageLimit } = await projectservice.getUserProjects(userId, page, limit);
  const currentUser = await userService.getUserById(req.user._id);

  // Render the view with pagination information
  res.render('project', {
    projects,
    currentUser,
    pagination: {
      currentPage,
      totalPages,
      limit: pageLimit
    },
    messages: {
      success: req.flash('success'),
      error: req.flash('error')
    }
  });
} catch (error) {
  console.error('Error fetching user projects:', error);
  res.status(500).send('Internal Server Error');
}
};
// This function retrieves the projects that the current user is following
exports.getFollowingProjects = async (req, res) => {
  try {
    // Get the projects that the current user is following
    const projects = await projectservice.getfollowingprojects(req.user._id);

    // Get the current user's information
    const currentuser = await userService.getUserById(req.user._id);

    // Render the project view with the retrieved projects and current user information
    res.render("project", {
      projects,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },
      currentuser
    });
  } catch (err) {
    console.error('Error retrieving following projects:', err);
    res.status(500).json("Something went wrong");
  }
};

// This function deletes a project
exports.deleteproject = async (req, res) => {
  try {
    // Get the project ID from the request parameters
    const id = xss(req.params.id);

    // Delete the project
    const del = await projectservice.deleteproject(id);

    // If the project was deleted successfully, flash a success message and redirect to the "myprojects" page
    if (del) {
      req.flash('success', 'successfully deleted the project');
      res.redirect("/projects/myprojects");
    } else {
      // If the project deletion was not successful, flash an error message and redirect to the "myprojects" page
      req.flash("error", "project deletion not successful");
      res.redirect("/projects/myprojects");
    }
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json("something went wrong");
  }
};

// This function registers a user's interest in a project
exports.registerInterestwithid = async (req, res) => {
  try {
    // Get the project ID and user ID from the request
    const projectId = xss(req.params.id);
    const userid = req.user._id;

    // Register the user's interest in the project
    const project = await projectservice.registerInterest(projectId, userid);

    // If the interest was registered successfully, flash a success message
    if (project) {
      req.flash('success', 'Interest successfully registered');
    } else {
      // If the interest was already registered, flash an error message
      req.flash('error', 'Interest already registered');
    }

    // Redirect the user to the project page
    res.redirect("/projects/projects/" + projectId);
  } catch (err) {
    console.error('Error registering interest:', err);
    res.status(500).json("something went wrong");
  }
};

// This function retrieves projects based on a category
exports.getcatprojects = async (req, res) => {
  try {
    // Get the page and limit from the request query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified

    // Get the category name from the request parameters
    const name = xss(req.params.name);

    // Fetch the paginated projects from the service
    const { projects, currentPage, totalPages, limit: pageLimit } = await projectservice.get_catblogs(name, req.user._id, page, limit);

    // Get the current user's information
    const currentuser = await userService.getUserById(req.user._id);

    // Render the project view with the retrieved projects, current user information, and pagination information
    res.render('project', {
      projects,
      currentuser,
      pagination: {
        currentPage,
        totalPages,
        limit: pageLimit
      },
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }
    });
  } catch (err) {
    console.error('Error retrieving category projects:', err);
    res.status(500).json("something went wrong");
  }
};

// This function retrieves the projects of a specific user
exports.getUserProjects = async (req, res) => {
  try {
    // Get the user ID from the request parameters
    const userId = req.params.id;

    // Get the page and limit from the request query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified

    // Fetch the paginated projects from the service
    const { projects, currentPage, totalPages, limit: pageLimit } = await projectservice.getUserProjects(userId, page, limit);

    // Get the current user's information
    const currentUser = await userService.getUserById(req.user._id);

    // Render the project view with the retrieved projects, current user information, and pagination information
    res.render('project', {
      projects,
      currentUser,
      pagination: {
        currentPage,
        totalPages,
        limit: pageLimit
      },
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }
    });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).send('Internal Server Error');
  }
};
