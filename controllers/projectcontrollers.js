const projectservice = require("../services/projectservice");
const flash = require('connect-flash');
const userService = require('../services/userservice');








exports.acceptinterest = async (req, res) => {
  console.log("accepted request");
  const userId = req.params.userid;
  const projectid = req.params.projectid;
  const result = await projectservice.acceptinterest(projectid, userId);
  if (result) {
    res.status(200).json({ message: 'added to the team' });
  } else {
    res.status(500).send('Internal Server Error');
  }
};




exports.newproject = async(req,res) =>
    {
      const tags = await projectservice.gettags();
      const currentuser =  userService.getUserById(req.user._id);
      res.render('addproject',{
        tags,
        
       messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser

    });
    }
    exports.createProject = async (req, res) => {
        const checkedOptions = req.body.myCheckboxes || [];
        const projectDetails = req.body;
        try {
          await projectservice.createProject(projectDetails, req.user._id,checkedOptions);
          res.redirect('/projects/myprojects');
        } catch (error) {
          console.error('Error creating project:', error);
          res.status(500).send('Internal Server Error');
        }
    
    };
exports.getcatagories = async(req,res) =>
      {
        const tags = await projectservice.gettags();
        const currentuser =  userService.getUserById(req.user._id);
        res.render("projectcatagories",{tags,currentuser,messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },})
      }

exports.getsearchresult = async(req,res) =>
{
  const query = req.params.text
  const projects = await projectservice.searchProjects(query);
  const currentuser =  await userService.getUserById(req.user._id);
  res.render("project",{projects, currentuser,messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }})

}

exports.getProjects = async(req,res) =>
{

    const projects = projectservice.getProjects(req.user._id);
    const currentuser =  userService.getUserById(req.user._id);
    res.render("project",{
        projects,
        messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser
})
}


exports.getMyProjects = async(req,res) =>
{

    const id = req.user._id;
    const project = await projectservice.getMyProject(id);
    const currentuser =  userService.getUserById(req.user._id);



    res.render("myproject",{
        project,
       messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser
     })



}



exports.getmycollabration = async(req,res) =>
{
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


exports.searchProjects = async(req,res) =>

{


    res.render("searchproject")

}
exports.searchResults = async(req,res) =>

{


    res.render("")
}

exports.getProjectById = async(req,res) =>

{
    const project = await projectservice.getProjectById(req.params.id);
    const currentuser =  userService.getUserById(req.user._id);

    res.render("specficproject",{
        project,
        messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser })
}


exports.getProjects = async(req,res) =>
{


    const projects = await projectservice.getProjects();
    const currentuser =  userService.getUserById(req.user._id);

    res.render("project",{projects,
        messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser
    })

}

exports.getmyprojectwithid = async(req,res) =>
{
    const project = await projectservice.getMyProjectbyid(req.params.id);
    const currentuser =  userService.getUserById(req.user._id);

   res.render("interestinmyproject",{project,
        messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser
   })
}
exports.getFollowingProjects = async(req,res) =>
{
    const projects = await projectservice.getfollowingprojects(req.user._id);
    const currentuser =  userService.getUserById(req.user._id);

    res.render("project",{projects,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser
    })

}

exports.deleteproject = async(req,res) =>
{
  try{
    const id = req.params.id
    const del = await projectservice.deleteproject(id);
    if(del)
    {
     
        req.flash('success', 'successfully deleted the project');
        res.redirect("/projects/myprojects")
    }
    else{
  
        req.flash("error", "project deletion not successful");
        res.redirect("/projects/myprojects")
    }
  }
  catch(err)
  {
    console.log(err)
    res.status(500).json("something went wrong")
  }

}


exports.registerInterestwithid = async(req,res) =>
{
    const projectId=req.params.id;
    const userid = req.user._id;
    const project = await projectservice.registerInterest(projectId, userid);
    if(project)
    {
      req.flash('success', 'Interest successfully registered');
        

    }
    else{req.flash('error', 'Interest already registered');
      
    }
    res.redirect("/projects/projects/"+projectId);
}



exports.getcatprojects = async(req,res) =>
{
  try{
  const name = req.params.name;
  const projects= await projectservice.get_catblogs(name);
  const currentuser =  await userService.getUserById(req.user._id);
 
    res.render("project", {projects,
      messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },currentuser
 })
  }
  catch(err)
  {
    console.log(err)
  }
  
}


