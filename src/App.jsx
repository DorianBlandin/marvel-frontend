import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Characters from "./pages/Characters";
import Comics from "./pages/Comics";
import Favorites from "./pages/Favorites";
import CharacterDetail from "./pages/CharacterDetail";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import ComicDetail from "./pages/ComicDetail";

function App() {
  const [userToken, setUserToken] = useState(
    localStorage.getItem("userToken") || null
  );
  const [favoriteCharacters, setFavoriteCharacters] = useState([]);
  const [favoriteComics, setFavoriteComics] = useState([]);

  const handleLogin = (token) => {
    setUserToken(token);
    localStorage.setItem("userToken", token);
  };

  const handleLogout = () => {
    setUserToken(null);
    localStorage.removeItem("userToken");
  };

  const toggleFavoriteComic = async (comic) => {
    try {
      const response = await axios.post(
        "https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites",
        {
          token: userToken,
          item: comic,
          type: "comic",
        }
      );
      setFavoriteComics(response.data.favoriteComics || []);
    } catch (error) {
      console.error(
        "❌ Erreur lors de la mise à jour des favoris comics :",
        error
      );
    }
  };

  const toggleFavoriteCharacter = async (character) => {
    try {
      const response = await axios.post(
        "https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites",
        {
          token: userToken,
          item: character,
          type: "character",
        }
      );
      setFavoriteCharacters(response.data.favoriteCharacters || []);
    } catch (error) {
      console.error(
        "❌ Erreur lors de la mise à jour des favoris personnages :",
        error
      );
    }
  };

  return (
    <Router>
      <Header userToken={userToken} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/characters"
          element={
            <Characters
              userToken={userToken}
              favoriteCharacters={favoriteCharacters}
              toggleFavorite={toggleFavoriteCharacter}
            />
          }
        />
        <Route
          path="/comics"
          element={
            <Comics
              userToken={userToken}
              favoriteComics={favoriteComics}
              toggleFavorite={toggleFavoriteComic}
            />
          }
        />
        <Route
          path="/favorites"
          element={<Favorites userToken={userToken} />}
        />
        <Route
          path="/character/:characterId"
          element={
            <CharacterDetail
              userToken={userToken}
              favoriteComics={favoriteComics}
              toggleFavorite={toggleFavoriteComic}
            />
          }
        />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/signup" element={<Signup setUser={setUserToken} />} />
        <Route path="/login" element={<Login setUser={setUserToken} />} />
        <Route path="*" element={<h2>404 - Page non trouvée</h2>} />
        <Route path="/comic/:comicId" element={<ComicDetail />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
