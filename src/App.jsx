import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Characters from "./pages/Characters";
import Comics from "./pages/Comics";
import Favorites from "./pages/Favorites";
import CharacterDetail from "./pages/CharacterDetail";
import Home from "./pages/Home";
import Header from "./components/Header";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");

  return (
    <Router>
      <Header onSearch={setSearch} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters search={search} />} />
        <Route path="/comics" element={<Comics search={search} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/character/:characterId" element={<CharacterDetail />} />
        <Route path="*" element={<h2>404 - Page non trouvée</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
