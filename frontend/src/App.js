import { Routes, Route } from 'react-router-dom'
import './App.css';
import PostsPage from './features/posts/PostPage';
import PostDetailPage from './features/posts/PostDetailPage';
import Footer from './features/footer/Footer';
import Nav from './features/nav/Nav';
import About from './features/about/About';
import BackToTop from './components/BackToTop';
import LoadingBar from './components/LoadingBar';
import KeyboardShortcuts from './components/KeyboardShortcuts';



function App() {
  return (
    <div className="App">
      <LoadingBar />
      <Nav /> 
      <Routes>
     <Route path='/'element={ <PostsPage /> } />
     <Route path = '/post/:postId' element={<PostDetailPage />} />
     <Route path = '/about' element={<About />} />
          </Routes> 
          <Footer />
          <BackToTop />
          <KeyboardShortcuts />
         </div>
           
  );
}

export default App;
