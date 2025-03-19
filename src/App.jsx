import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Characters from "./pages/Characters";
import Comics from "./pages/Comics";
import Favorites from "./pages/Favorites";
import CharacterDetail from "./pages/CharacterDetail";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults"; // ✅ Nouvelle page
import Header from "./components/Header";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/comics" element={<Comics />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/character/:characterId" element={<CharacterDetail />} />
        <Route path="/search" element={<SearchResults />} />{" "}
        {/* ✅ Route ajoutée */}
        <Route path="*" element={<h2>404 - Page non trouvée</h2>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
