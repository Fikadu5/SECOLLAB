const projectservice = require("../services/projectservice");
const flash = require('connect-flash');
const userService = require('../services/userservice');





exports.acceptinterest = async(req,res) =>{
  const projectid = req.params.projectid;
  const userid = req.params.userid;
  const acceptinterest = projectservice.acceptinterest();
  if (acceptinterest)
  {
    res.status(200).json({"message":'added to the team'});
  }
  else{
    res.status(500).send('Internal Server Error');
  }
}



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
        const tags = await projectService.gettags();
        const currentuser =  userService.getUserById(req.user._id);
        res.render("projectcatagories",{tags,currentuser})
      }

exports.getsearchresult = async(req,res) =>
{

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
    const projects = projectservice.getcollabration(id)
    const currentuser =  userService.getUserById(req.user._id);

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

    res.render("projects",{projects,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser
    })

}

exports.deleteproject = async(req,res) =>
{
    const id = req.params.id
    const del = projectservice.deleteproject(id);
    if(del)
    {
     
        req.flash('success', 'successfully deleted the project');
        res.redirect("/projects/myprojects")
    }
    else{
  
        req.flash('error', 'project deletion not successful');
        res.redirect("/projects/myprojects")
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
    res.redirect("/projects");
}

