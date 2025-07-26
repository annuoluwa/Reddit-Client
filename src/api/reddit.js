async function fetchPopularPosts() {
  try {
    const response = await fetch("http://localhost:4000/reddit/popular");

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

