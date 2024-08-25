const User = require('../models/user');
const validator = require('validator');

exports.createAndRegister = async (details) => {
    try {
        const user = new User({
            fname: validator.escape(details.fname),
            lname: validator.escape(details.lname),
            username: validator.escape(details.username),
            twitter: validator.escape(details.twitter),
            phone_number: validator.escape(details.phone_number),
            github: validator.escape(details.github),
            previous: validator.escape(details.previous),
            country: validator.escape(details.country),
            city: validator.escape(details.city),
            skills: validator.escape(details.skills),
            email: validator.escape(details.email),
            education_status: validator.escape(details.education_status),
            employment_status: validator.escape(details.employment_status)
        });

        const registeredUser = user.save()
        return registeredUser;
    } catch (error) {
        console.error('Problem with registering user:', error);
        if (error.errors) {
            for (let key in error.errors) {
                console.error(`Validation error for ${key}: ${error.errors[key].message}`);
            }
        }
        throw error;
    }
};
