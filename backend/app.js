
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const fetch = require('node-fetch');

const app = express();

console.log('APP.JS STARTED');

// Logging
app.use(morgan('dev'));
app.use(cors());

// Catch uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason && reason.stack ? reason.stack : reason);
});

// Serve React build
app.use(express.static(path.join(__dirname, '../reddit-client/build')));

// Helper function for Reddit fetch
const fetchRedditJSON = async (url) => {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'reddit-proxy-bot/1.0' }
  });
  if (!response.ok) {
    throw new Error(`Reddit fetch failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Search route
app.get('/search', async (req, res) => {
  try {
    const { q, limit, after } = req.query;

    if (!q || typeof q !== 'string' || q.trim() === '') {
      return res.status(400).json({ error: 'Missing or invalid search query' });
    }

    let limitValue = parseInt(limit, 10);
    if (isNaN(limitValue) || limitValue < 1) limitValue = 5;
    if (limitValue > 100) limitValue = 100;

    let queryString = `?q=${encodeURIComponent(q)}&limit=${limitValue}&sort=relevance&type=link`;
    if (after) queryString += `&after=${after}`;

    const url = `https://www.reddit.com/search.json${queryString}`;
    const data = await fetchRedditJSON(url);

    res.json(data);
  } catch (error) {
    console.error('Error in /search:', error && error.stack ? error.stack : error);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

// Subreddit posts route
app.get('/reddit/:subreddit', async (req, res) => {
  try {
    const { subreddit } = req.params;
    const { after, limit } = req.query;

    let limitValue = parseInt(limit, 10);
    if (isNaN(limitValue) || limitValue < 1) limitValue = 5;
    if (limitValue > 100) limitValue = 100;

    const queryString = `?limit=${limitValue}${after ? `&after=${after}` : ''}`;
    const url = `https://www.reddit.com/r/${subreddit}.json${queryString}`;

    const data = await fetchRedditJSON(url);
    res.json(data);
  } catch (error) {
    console.error('Error in /reddit/:subreddit:', error && error.stack ? error.stack : error);
    res.status(500).json({ error: 'Failed to fetch subreddit posts' });
  }
});

// Comments route
app.get('/comments/:subreddit/:postId', async (req, res) => {
  try {
    const { subreddit, postId } = req.params;
    const url = `https://www.reddit.com/r/${subreddit}/comments/${postId}.json`;

    const data = await fetchRedditJSON(url);
    res.json(data);
  } catch (error) {
    console.error('Error in /comments/:subreddit/:postId:', error && error.stack ? error.stack : error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Reddit proxy server is running');
});

module.exports = app;