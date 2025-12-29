const serverless = require('serverless-http');
const app = require('./app');

// Export the app as a serverless handler
module.exports.handler = serverless(app);