module.exports = {
	transform: {
		'^.+\\.jsx?$': 'babel-jest', // Transform JavaScript and JSX files using babel-jest
	  },
	testEnvironment: 'node',
	verbose: true,
	testMatch: ['**/test/**/*.test.js'],
	// Other configurations if needed
  };
  
