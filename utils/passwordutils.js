const bcrypt = require('bcrypt');

exports.validatePasswords = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new ValidationError('Passwords do not match.');
  }
};

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}