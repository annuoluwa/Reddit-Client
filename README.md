# Reddit Client

A modern React-based client for browsing Reddit posts by subreddit, with search, sorting, pagination, bookmarks, and dark/light theme support.

## Features

- 🔍 **Browse posts** from any subreddit
- 🔎 **Search posts** by title (real-time)
- 📊 **Sort posts** by Hot, New, Top, Rising
- 📄 **Pagination** with "View More" button
- 🔖 **Bookmark posts** (persisted to localStorage)
- 🌙 **Dark/Light theme** toggle
- ⌨️ **Keyboard shortcuts** (/, t, r, j, k, ESC)
- 🖼️ **Image modal** for full-size viewing
- 📱 **Responsive design** (mobile-friendly)
- ⚡ **Loading progress bar** with skeleton screens
- 🔗 **Share posts** (copy link to clipboard)
- ❌ **Error handling** with retry button

## Project Structure

```
reddit-client/
├── frontend/                    # React app
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── context/             # React Context (Theme, Toast)
│   │   ├── features/            # Feature modules (posts, nav, footer, search)
│   │   ├── hooks/               # Custom hooks
│   │   ├── App.jsx              # Main app component
│   │   ├── index.js             # Entry point
│   │   └── store.js             # Redux store setup
│   ├── package.json
│   └── netlify.toml             # Netlify config
│
├── backend/                     # Express server (proxy)
│   ├── server.js                # Main server
│   ├── package.json
│   └── netlify/functions/       # Netlify Functions
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/reddit-client.git
   cd reddit-client
   ```

2. Install frontend dependencies:
   ```sh
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```sh
   cd ../backend
   npm install
   ```

## Running the App

### Development Mode

1. **Start backend** (from `backend/` directory):
   ```sh
   npm start
   ```
   Backend runs on `http://localhost:4000`

2. **Start frontend** (from `frontend/` directory in another terminal):
   ```sh
   npm start
   ```
   Frontend runs on `http://localhost:3000`

### Production Build

1. Build frontend (from `frontend/` directory):
   ```sh
   npm run build
   ```

2. Deploy to Netlify:
   ```sh
   netlify deploy --prod
   ```

## Deployment

This project is deployed on **Netlify** with the following setup:

### Frontend (Netlify Hosting)
- Hosted on Netlify at `https://yourdomain.netlify.app`
- Auto-deploys on push to main branch
- Environment: Production React build

### Backend (Netlify Functions)
- Proxy server runs as Netlify Functions
- Handles Reddit API calls
- Base URL: `/api` (same domain as frontend)
- CORS enabled for seamless requests

### Deployment Steps

1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/build`
5. Deploy! (auto-triggers on push)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `t` | Toggle theme (dark/light) |
| `r` | Refresh posts |
| `j` | Next post (scroll) |
| `k` | Previous post (scroll) |
| `ESC` | Exit search/input |

## API

This client uses a backend proxy running at `/api`:

- `GET /api/reddit/:subreddit` - Fetch posts from subreddit
- `GET /api/comments/:subreddit/:postId` - Fetch post comments
- `GET /api/search?q=query` - Search posts

The backend proxies requests to Reddit's JSON API.

## Technologies Used

- **Frontend**: React, Redux Toolkit, React Router, CSS Modules
- **Backend**: Express.js, Axios
- **Deployment**: Netlify (Hosting + Functions)
- **Styling**: CSS Modules with CSS Variables
- **State**: Redux + React Context (Theme, Toast)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT
