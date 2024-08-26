const User = require('../models/user');
const validator = require('validator');

/**
 * Creates and registers a new user.
 * @param {Object} details - The details of the user to be created.
 * @param {string} details.fname - The first name of the user.
 * @param {string} details.lname - The last name of the user.
 * @param {string} details.username - The username of the user.
 * @param {string} details.twitter - The Twitter handle of the user.
 * @param {string} details.phone_number - The phone number of the user.
 * @param {string} details.github - The GitHub profile of the user.
 * @param {string} details.previous - The previous experience of the user.
 * @param {string} details.country - The country of the user.
 * @param {string} details.city - The city of the user.
 * @param {string} details.skills - The skills of the user.
 * @param {string} details.email - The email of the user.
 * @param {string} details.education_status - The education status of the user.
 * @param {string} details.employment_status - The employment status of the user.
 * @returns {Promise<User>} - The registered user.
 */
exports.createAndRegister = async (details) => {
    try {
        // Create a new user instance
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

        // Save the user and return the registered user
        const registeredUser = await user.save();
        return registeredUser;
    } catch (error) {
        console.error('Problem with registering user:', error);
        if (error.errors) {
            // Log validation errors
            for (let key in error.errors) {
                console.error(`Validation error for ${key}: ${error.errors[key].message}`);
            }
        }
        throw error;
    }
};