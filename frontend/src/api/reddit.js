const BASE_URL = "/api"; 

async function fetchPopularPosts() {
  try {
    const response = await fetch(`${BASE_URL}/reddit/popular`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export default fetchPopularPosts;
