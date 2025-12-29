const BASE_URL = process.env.REACT_APP_API_URL;

async function fetchPopularPosts() {
  try {
    const response = await fetch(`${BASE_URL}/reddit/popular`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Request failed!');
    }

  } catch (error) {
    console.log('Fetch error:', error);
  }
}

export default fetchPopularPosts;

