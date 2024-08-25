const mongoose = require('mongoose');


const projectTagSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      unique: true
    }
  });
  
  
  
  const ProjectTag = mongoose.model('ProjectTag', projectTagSchema);
  
  module.exports = ProjectTag;