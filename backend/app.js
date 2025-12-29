const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const fetch = require('node-fetch');

const app = express();

app.use(morgan('dev'));
app.use(cors());




const fetchRedditJSON = async (url) => {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'reddit-proxy-bot/1.0' }
  });

  if (!response.ok) {
    throw new Error(`Reddit fetch failed: ${response.status}`);
  }

  return response.json();
};


// Search
app.get('/search', async (req, res) => {
  try {
    const { q, limit = 5, after } = req.query;

    if (!q?.trim()) {
      return res.status(400).json({ error: 'Invalid search query' });
    }

    const query =
      `?q=${encodeURIComponent(q)}` +
      `&limit=${Math.min(Number(limit) || 5, 100)}` +
      `&sort=relevance&type=link` +
      (after ? `&after=${after}` : '');

    const data = await fetchRedditJSON(
      `https://www.reddit.com/search.json${query}`
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Subreddit posts
app.get('/reddit/:subreddit', async (req, res) => {
  try {
    const { subreddit } = req.params;
    const { after, limit = 5 } = req.query;

    const query =
      `?limit=${Math.min(Number(limit) || 5, 100)}` +
      (after ? `&after=${after}` : '');

    const data = await fetchRedditJSON(
      `https://www.reddit.com/r/${subreddit}.json${query}`
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subreddit' });
  }
});

// Comments
app.get('/comments/:subreddit/:postId', async (req, res) => {
  try {
    const { subreddit, postId } = req.params;

    const data = await fetchRedditJSON(
      `https://www.reddit.com/r/${subreddit}/comments/${postId}.json`
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Reddit proxy running' });
});

app.use(
  express.static(
    path.join(__dirname, '../reddit-client/build')
  )
);


// Catch-all 404 handler for unmatched routes (always returns JSON)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Error handling middleware (always returns JSON)
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error', details: err.message });
});

module.exports = app;
