import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";
import Card from "../components/Card";

function Characters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [charSearch, setCharSearch] = useState("");
  const [charSuggestions, setCharSuggestions] = useState([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/characters",
          {
            params: { limit: 100, skip: (page - 1) * 100, name: charSearch },
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
  }, [page, charSearch]);

  useEffect(() => {
    const fetchCharSuggestions = async () => {
      if (charSearch.length > 1) {
        try {
          const response = await axios.get(
            "https://site--marvel--pj2lbzfpm8z4.code.run/characters",
            { params: { limit: 5, name: charSearch } }
          );
          setCharSuggestions(response.data.results);
        } catch (error) {
          console.error("Erreur suggestions personnages :", error);
        }
      } else {
        setCharSuggestions([]);
      }
    };

    fetchCharSuggestions();
  }, [charSearch]);

  const handleSuggestionClick = (name) => {
    setCharSearch(name);
    setCharSuggestions([]);
  };

  return (
    <div className="characters-background">
      <div className="local-search-container">
        <div className="local-search">
          <FontAwesomeIcon icon={faSuperpowers} className="local-search-icon" />
          <input
            type="text"
            placeholder="Rechercher un personnage..."
            value={charSearch}
            onChange={(e) => setCharSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
        {charSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {charSuggestions.map((char) => (
              <li
                key={char._id}
                onClick={() => handleSuggestionClick(char.name)}
              >
                <img
                  src={`${char.thumbnail.path}/portrait_xlarge.${char.thumbnail.extension}`}
                  alt={char.name}
                />
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
            <Card key={char._id} item={char} />
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
