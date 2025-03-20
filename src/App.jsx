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
import "./App.css";

function App() {
  const [userToken, setUserToken] = useState(
    localStorage.getItem("userToken") || null
  );
  const handleLogin = (token) => {
    setUserToken(token);
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setUserToken(null);
    localStorage.removeItem("userToken");
  };
  return (
    <Router>
      <Header userToken={userToken} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/comics" element={<Comics />} />
        <Route
          path="/favorites"
          element={<Favorites userToken={userToken} />}
        />
        <Route path="/character/:characterId" element={<CharacterDetail />} />
        <Route path="/search" element={<SearchResults />} />{" "}
        <Route path="*" element={<h2>404 - Page non trouvée</h2>} />
        <Route path="/signup" element={<Signup setUser={setUserToken} />} />
        <Route path="/login" element={<Login setUser={setUserToken} />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
