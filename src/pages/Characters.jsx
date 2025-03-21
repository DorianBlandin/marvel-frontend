import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";
import { FaHeart } from "react-icons/fa";
import Card from "../components/Card";

function Characters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [favoriteCharacters, setFavoriteCharacters] = useState(
    JSON.parse(localStorage.getItem("favoriteCharacters")) || []
  );
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/characters",
          {
            params: { limit: 100, skip: (page - 1) * 100, name: search },
          }
        );
        setCharacters(response.data.results);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des personnages :",
          error
        );
      }
      setLoading(false);
    };

    fetchCharacters();
  }, [page, search]);

  useEffect(() => {
    if (search.length > 1) {
      const filteredSuggestions = characters.filter((char) =>
        char.name.toLowerCase().includes(search.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [search, characters]);

  const toggleFavorite = (char) => {
    let newFavorites;
    if (favoriteCharacters.some((fav) => fav._id === char._id)) {
      newFavorites = favoriteCharacters.filter((fav) => fav._id !== char._id);
    } else {
      newFavorites = [...favoriteCharacters, char];
    }
    setFavoriteCharacters(newFavorites);
    localStorage.setItem("favoriteCharacters", JSON.stringify(newFavorites));
  };

  return (
    <div>
      <div className="local-search-container">
        <div className="local-search">
          <FontAwesomeIcon icon={faSuperpowers} className="local-search-icon" />
          <input
            type="text"
            placeholder="Rechercher un personnage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((char) => (
              <li key={char._id} onClick={() => setSearch(char.name)}>
                {char.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid-container">
          {characters.map((char) => (
            <Card
              key={char._id}
              item={char}
              isFavorite={favoriteCharacters.some(
                (fav) => fav._id === char._id
              )}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
          Précédent
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>Suivant</button>
      </div>
    </div>
  );
}

export default Characters;
