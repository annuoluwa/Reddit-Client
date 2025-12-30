const serverless = require('serverless-http');
const app = require('./app');

module.exports.handler = serverless(app, {
  basePath: '/.netlify/functions/lambda'
});
