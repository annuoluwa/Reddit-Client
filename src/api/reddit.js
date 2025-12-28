async function fetchPopularPosts() {
  try {
    const response = await fetch("https://www.reddit.com/r/popular.json", {
      headers: {
        'User-Agent': 'web:reddit-client:v1.0.0'
      }
    });

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

