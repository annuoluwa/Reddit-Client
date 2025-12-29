import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = process.env.REACT_APP_API_URL;

//Asyncthunk to take care of asychronous functions of the app
const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({subreddit, after = '', limit = 5}, {rejectWithValue}) => {
    try {
      const afterQuery = after ? `&after=${after}` : '';
     const url = `${BASE_URL}/reddit/${subreddit}?limit=${limit}${afterQuery}`;

      console.log('Fetching from:', url); //
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data); // log full response

 
if (data && (data.error || data.reason)) {
        const msg = data.message || data.reason || "Reddit API error";
        return rejectWithValue(`${msg} (${data.error ?? "no-code"})`);
      }


 if (!data || !data.data || !Array.isArray(data.data.children)){
      console.error('Unexpected response format:', data);
      throw new Error('Invalid data structure from Reddit API');
    }

      return {
         posts: data.data.children.map(child => child.data), //  array of posts
         after: data.data.after, //pagination cursor token
         hasMore: Boolean(data.data.after)
      }
       
    } catch (err) {
      console.error('Fetch failed in thunk:', err);
      return rejectWithValue(err.message);
    }
  }
);


const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [], //to store fetched reddit
        status: "idle", //to track status of requests idle/ loading / succeeded / failed
        error: null, // for any error messages if fetch fails
        currentSubreddit: 'all',
        after: null,
        hasMore: true,
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
    state.currentSubreddit = action.meta.arg.subreddit; //  Store subreddit from request
if (!action.meta.arg.after) {
          state.posts = [];
          state.after = null;
          state.hasMore = true;
        }
  })
 .addCase(fetchPosts.fulfilled, (state, action) => {
        const { posts: newPosts, after } = action.payload;
        const isAppend = !!action.meta.arg.after;

        if (isAppend) {
          // append then dedupe by id (keep first occurrence)
          const combined = [...state.posts, ...newPosts];
          state.posts = [...new Map(combined.map((p) => [p.id, p])).values()];
        } else {
          // initial load — replace
          state.posts = newPosts;
        }
      
        state.after = action.payload.after;
        state.hasMore = Boolean(after);
        state.status = "succeeded";
        state.error = null;
      })  
      
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        // prefer rejectWithValue payload if provided
        state.error = action.payload || action.error?.message || "Failed to fetch posts";

        // If initial load failed, clear posts/after so stale data doesn't remain
        if (!action.meta?.arg?.after) {
          state.posts = [];
          state.after = null;
          state.hasMore = false;
        }
      });
}
});

export default postsSlice.reducer; 
export const {addPost, setCurrentSubreddit} = postsSlice.actions;
export const selectPosts = (state) => state.posts.posts;
export const selectPostStatus = (state) => state.posts.status;
export const selectPostError = (state) => state.posts.error;
export const selectAfter =(state) => state.posts.after;
export const selectHasMore = (state) => state.posts.hasMore;
export { fetchPosts };
