import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import SavedPostsPage from './pages/SavedPostsPage';
import MyPostsPage from './pages/MyPostsPage';
import RecipesPage from './pages/RecipesPage';
import ProfileOtherDetailsPage from "./pages/ProfileOtherDetailsPage"; // הוספת ייבוא


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/saved-posts" element={<SavedPostsPage />} />
        <Route path="/my-posts" element={<MyPostsPage />} />
        <Route path="/recipes" element={<RecipesPage />} /> 
        <Route path="/profile/:userId" element={<ProfileOtherDetailsPage />} /> {/* הוספת נתיב */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;