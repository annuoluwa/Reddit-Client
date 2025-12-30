const serverless = require('serverless-http');
const app = require('./app');

const handler = process.env.NETLIFY_DEV 
  ? serverless(app, { basePath: '/api' })
  : serverless(app);

module.exports.handler = handler;
