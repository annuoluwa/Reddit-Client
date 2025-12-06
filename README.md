# Reddit Client

A simple React-based client for browsing Reddit posts by subreddit, with search and pagination support.

## Features

- Browse posts from any subreddit
- Search posts by title
- Pagination ("View More" button)
- Error handling and loading states
- Responsive UI

## Project Structure
reddit-client/
├── public/ # Static files (index.html, manifest, robots.txt)
├── src/ # Source code
│ ├── api/ # API utilities (Reddit fetch logic)
│ ├── features/ # Feature modules (posts, nav, footer, search)
│ ├── App.js # Main app component
│ ├── store.js # Redux store setup
│ └── ... # Other components and styles
├── build/ # Production build output
├── package.json # Project metadata and scripts
└── README.md # Project documentation

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/reddit-client.git
   cd reddit-client```

2. Install dependencies:
    ```
    npm install
    ```
    Running the App
    Start the development server:
    ```
    npm start
    ```

    Open http://localhost:3000 in your browser.

## API
This client expects a backend proxy running at http://localhost:4000/reddit/:subreddit.
You can use src/api/reddit.js as a reference for API calls.

## Usage

- Go to the search bar and type a subreddit name (e.g., `reactjs`)
- Click "View More" to load additional posts
- Posts display title, author, and link to Reddit


## Technologies Used
- React
- Redux Toolkit
- React Router
- CSS Modules

## License
- MIT
