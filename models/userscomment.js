const mongoose = require('mongoose');


  
const userCommentSchema = new mongoose.Schema({
    email:{
      type:String,
      required:true
    },
    comment: {
      type: String,
      required: true
    },
    
});

const Usercomment = mongoose.model("Usercomment",userCommentSchema);

// Exporting schemas as an object
module.exports = Usercomment;
