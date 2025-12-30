import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "/api";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ subreddit, after = "", limit = 5, sort = "hot" }, { rejectWithValue }) => {
    try {
      const afterQuery = after ? `&after=${after}` : "";
      const sortQuery = sort ? `&sort=${sort}` : "";
      const response = await fetch(
        `${BASE_URL}/reddit/${subreddit}?limit=${limit}${afterQuery}${sortQuery}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data?.data?.children) {
        throw new Error("Invalid response");
      }

      return {
        posts: data.data.children.map(c => c.data),
        after: data.data.after,
        hasMore: Boolean(data.data.after),
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
    currentSubreddit: "popular",
    after: null,
    hasMore: true,
  },
  reducers: {
    setCurrentSubreddit(state, action) {
      state.currentSubreddit = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        window.dispatchEvent(new Event('fetch-start'));
        state.status = "loading";
        state.error = null;
        if (!action.meta.arg.after) {
          state.posts = [];
          state.after = null;
          state.hasMore = true;
        }
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        window.dispatchEvent(new Event('fetch-end'));
        const isAppend = Boolean(action.meta.arg.after);
        state.posts = isAppend
          ? [...new Map([...state.posts, ...action.payload.posts].map(p => [p.id, p])).values()]
          : action.payload.posts;
        state.after = action.payload.after;
        state.hasMore = action.payload.hasMore;
        state.status = "succeeded";
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        window.dispatchEvent(new Event('fetch-end'));
        state.status = "failed";
        state.error = action.payload || "Fetch failed";
        state.posts = [];
        state.after = null;
        state.hasMore = false;
      });
  },
});

export default postsSlice.reducer;
export const { setCurrentSubreddit } = postsSlice.actions;

export const selectPosts = state => state.posts.posts;
export const selectPostStatus = state => state.posts.status;
export const selectPostError = state => state.posts.error;
export const selectAfter = state => state.posts.after;
export const selectHasMore = state => state.posts.hasMore;
