const mongoose = require('mongoose');


const projectTagSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    }
  });
  
  // Generate slug automatically before saving
//   projectTagSchema.pre('save', function(next) {
//     if (this.isModified('name')) {
//       this.slug = this.name.toLowerCase().replace(/ /g, '-');
//     }
//     next();
//   });
  
  const ProjectTag = mongoose.model('ProjectTag', projectTagSchema);
  
  module.exports = ProjectTag;
