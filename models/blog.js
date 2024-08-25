const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  like: {
    type: Number,
    default: 0
  },
  likedby: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  subtitle: {
    type: String
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogTag'
  }],
  body: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String
  }
});


const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
