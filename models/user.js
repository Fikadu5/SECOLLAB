const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const followerSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const userSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    twitter: String,
    phone_number: { type: String, required: true },
    age: { type: Number, required: true },
    about_me: String,
    github: String,
   
    previous: { type: String, required: true },
    country: String,
    city: String,
    employment_status: String,
    education_status: String,
    image:String,
    skills: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    followers: [followerSchema]
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);
const Follow = mongoose.model('Follower', followerSchema);


module.exports = { User, Follow };

