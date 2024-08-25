const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  looking_for:{
    type:String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  requests:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectTag'
  }],
  requirment:{
    type:String,
    required:true
  },
  dueDate: {
    type: Date
    
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;