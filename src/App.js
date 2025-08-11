import { Routes, Route } from 'react-router-dom'
import './App.css';
import PostsPage from './features/posts/PostPage';
import PostDetailPage from './features/posts/PostDetailPage';
import Footer from './features/footer/Footer';
import Nav from './features/nav/Nav';

function App() {
  return (
    <div className="App">
      <Nav /> 
      <Routes>
     <Route path='/'element={ <PostsPage /> } />
     <Route path = '/post/:postId' element={<PostDetailPage />} />
     
          </Routes>
          
          <Footer />
         </div>
           
  );
}

export default App;
