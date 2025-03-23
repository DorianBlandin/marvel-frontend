import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Characters from "./pages/Characters";
import Comics from "./pages/Comics";
import Favorites from "./pages/Favorites";
import CharacterDetail from "./pages/CharacterDetail";
import ComicDetail from "./pages/ComicDetail";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useState } from "react";
import "./App.css";

function App() {
  const [userToken, setUserToken] = useState(
    localStorage.getItem("userToken") || null
  );

  const handleLogout = () => {
    setUserToken(null);
    localStorage.removeItem("userToken");
  };

  return (
    <Router>
      <Header userToken={userToken} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home userToken={userToken} />} />
        <Route
          path="/characters"
          element={<Characters userToken={userToken} />}
        />
        <Route path="/comics" element={<Comics userToken={userToken} />} />
        <Route
          path="/favorites"
          element={<Favorites userToken={userToken} />}
        />
        <Route
          path="/character/:characterId"
          element={<CharacterDetail userToken={userToken} />}
        />
        <Route
          path="/comic/:comicId"
          element={<ComicDetail userToken={userToken} />}
        />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/signup" element={<Signup setUser={setUserToken} />} />
        <Route path="/login" element={<Login setUser={setUserToken} />} />
        <Route path="*" element={<h2>404 - Page non trouvée</h2>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
