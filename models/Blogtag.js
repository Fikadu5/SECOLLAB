const mongoose = require('mongoose');

const blogtagschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    }
});
const BlogTag = mongoose.model('BlogTag', blogtagschema);

module.exports = BlogTag;
