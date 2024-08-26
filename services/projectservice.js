// Importing required models
const Project = require('../models/project');
const ProjectTag = require('../models/Projecttag');
const { User, Follow } = require('../models/user');

// Function to get the projects that the user is following
exports.getfollowingprojects = async (userId) => {
  // 1. Find all users that the given user is following
  const followings = await Follow.find({ follower: userId }).populate('following').sort({ createdAt: -1 }).exec();

  // Extract the following users' IDs
  const followingUserIds = followings.map(follow => follow.following._id);

  // If the user is not following anyone, return an empty array
  if (followingUserIds.length === 0) {
    return [];
  }

  // Fetch the projects owned by the users the current user is following
  const projects = await Project.find({ owner: { $in: followingUserIds } }).populate("owner").populate("tags");
  return projects;
};

// Function to get all projects except the ones owned by the given user
exports.getProjects = async (id) => {
  try {
    console.log("fetching from database");
    const results = await Project.find({ owner: { $ne: id } })
      .populate('owner')
      .populate('tags')
      .sort({ createdAt: -1 });
    return results;
  } catch (e) {
    console.log(e);
  }
};

// Function to register interest in a project
exports.registerInterest = async (projectId, userId) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return false;
    }

    // Check if the user has already registered interest or is already a collaborator
    if (project.requests.includes(userId) || project.collaborators.includes(userId)) {
      console.log("Interest already registered or user is already a collaborator");
      return project;
    }

    // Add the user to the project's requests array
    project.requests.push(userId);
    await project.save();
    console.log("Interest registered successfully");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// Function to create a new project
exports.createProject = async (projectDetails, user_id, checkedOptions) => {
  const project = new Project({
    title: projectDetails.name,
    owner: user_id,
    description: projectDetails.description,
    dueDate: projectDetails.date,
    looking_for: projectDetails.lookingfor,
    requirment: projectDetails.requirment,
    tags: checkedOptions
  });

  try {
    await project.save();
  } catch (error) {
    throw new Error('Error creating project', error);
  }
};

// Function to get all project tags
exports.gettags = async () => {
  const tags = await ProjectTag.find();
  return tags;
};

// Function to search for projects
exports.searchProjects = async (query) => {
  try {
    const projects = await Project.find({
      $text: { $search: query }
    });
    return projects;
  } catch (err) {
    console.error('Error searching projects:', err);
    throw err;
  }
};

// Function to get a user's own projects
exports.getMyProject = async (id) => {
  try {
    const projects = await Project.find({ owner: id }).sort({ createdAt: -1 });
    if (projects) {
      console.log("project found");
      return projects;
    } else {
      console.log("no project is found");
    }
  } catch (error) {
    console.log("An error occurred while fetching projects.", error);
  }
};

// Function to get a project by its ID
exports.getProjectById = async (projectId) => {
  try {
    return await Project.findById(projectId)
      .populate("owner")
      .populate("tags")
      .populate("requests")
      .populate("collaborators")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error('Error fetching project');
  }
};

// Function to get a user's projects
exports.getUserProjects = async (userId) => {
  try {
    if (userId == null) {
      throw new Error('Error fetching user projects');
    }
    return await Project.find({ user_id: userId }).sort({ createdAt: -1 });
  } catch (error) {
    throw new Error('Error fetching user projects');
  }
};

// Function to get a limited number of projects
exports.getProject = async () => {
  try {
    return await Project.find().limit(5).populate("tags");
  } catch (error) {
    throw new Error("Error fetching projects");
  }
};

// Function to accept a user's interest in a project
exports.acceptinterest = async (projectid, userId) => {
  try {
    const project = await Project.findById(projectid);
    if (!project) {
      return false;
    }
    if (project.owner == userId) {
      return false;
    }
    if (project.collaborators.includes(userId)) {
      console.log("already in the team");
      return false;
    }
    project.collaborators.push(userId);
    project.requests.pull(userId);
    await project.save();
    console.log("Successfully saved");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// Function to get a project by its ID, including collaborators and requests
exports.getMyProjectbyid = async (id) => {
  const project = await Project.findById(id)
    .populate("collaborators")
    .populate("requests")
    .sort({ createdAt: -1 });
  return project;
};

// Function to get projects a user is collaborating on
exports.getcollabration = async (id) => {
  try {
    let project = [];
    const projects = await Project.find();
    projects.forEach(async (p) => {
      if (p.collaborators.includes(id)) {
        project.push(p);
      }
    });
    return project;
  } catch (err) {
    console.log(err);
  }
};

// Function to delete a project
exports.deleteproject = async (id) => {
  try {
    const result = await Project.deleteOne({ _id: id });
    return result;
  } catch (err) {
    console.error('Error deleting project:', err);
    throw err;
  }
};

// Function to get projects by a specific tag and pagination
exports.get_catblogs = async (name, id, page = 1, limit = 10) => {
  console.log(name);
  const projecttag = await ProjectTag.findOne({ name: name });
  if (!projecttag) {
    console.log("Tag not found");
    return;
  }

  // Calculate the number of projects to skip based on the page and limit
  const skip = (page - 1) * limit;

  // Fetch the projects with the specified tag, excluding the projects owned by the user
  const projects = await Project.find({ tags: { $in: [projecttag._id] }, owner: { $ne: id } })
    .sort({ created_at: 1 })
    .populate("tags")
    .populate('owner')
    .skip(skip)
    .limit(parseInt(limit));

  // Get the total count of projects
  const totalProjects = await Project.countDocuments({ owner: id });

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalProjects / limit);

  return {
    projects,
    currentPage: parseInt(page),
    totalPages,
    limit: parseInt(limit)
  };
};

// Function to get a user's projects with pagination
exports.getUserProjects = async (id, page = 1, limit = 10) => {
  console.log(id);

  // Calculate the number of projects to skip
  const skip = (page - 1) * limit;

  // Fetch the projects with pagination
  const projects = await Project.find({ owner: id })
    .populate('owner')
    .populate('tags')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get the total count of projects
  const totalProjects = await Project.countDocuments({ owner: id });

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalProjects / limit);

  return {
    projects,
    currentPage: parseInt(page),
    totalPages,
    limit: parseInt(limit)
  };
};