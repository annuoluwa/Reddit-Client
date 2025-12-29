const app = require('./app');
const PORT = process.env.PORT || 4000;

if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
  // Running in Lambda/Netlify environment
  const serverless = require('serverless-http');
  module.exports.handler = serverless(app);
} else {
  // Local dev server
  app.listen(PORT, () => {
    console.log(`Reddit proxy server running on http://localhost:${PORT}`);
  });
}
