import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

//Asyncthunk to take care of asychronous functions of the app
const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (subreddit, thunkAPI) => {
    try {
     const url = `http://localhost:4000/reddit/${subreddit}`;

      console.log('Fetching from:', url); // ✅ confirm URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data); // ✅ log full response
if (!data?.data?.children) {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid data structure from Reddit API');
    }
      return data.data.children.map(child => child.data); // ✅ array of posts
    } catch (err) {
      console.error('Fetch failed in thunk:', err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [], //to store fetched reddit
        status: "idle", //to track status of requests idle/ loading / succeeded / failed
        error: null, // for any error messages if fetch fails
        currentSubreddit: 'all'
    },
    reducers: {
    
    addPost: (state, action) => {
state.posts.push(action.payload); //push new post to existing posts array
    },
setCurrentSubreddit(state, action) {
      state.currentSubreddit = action.payload;
    }
    
},

extraReducers: (builder)=> {
builder
.addCase(fetchPosts.pending, (state, action) => {
    state.status = 'loading';
    state.error = null;
    state.currentSubreddit = action.meta.arg; //  Store subreddit from request
})
.addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.posts = action.payload; // ✅ always use latest
    })
    
  .addCase(fetchPosts.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.error.message
    
})
}
});

export default postsSlice.reducer; 
export const {addPost} = postsSlice.actions;
export const {setCurrentSubreddit} = postsSlice.actions
export const selectPosts = (state) => state.posts.posts;
export const selectPostStatus = (state) => state.posts.status;
export const selectPostError = (state) => state.posts.error;
export { fetchPosts };
