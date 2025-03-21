import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";
import Card from "../components/Card";

function Comics() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [favoriteComics, setFavoriteComics] = useState(
    JSON.parse(localStorage.getItem("favoriteComics")) || []
  );
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchComics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/comics",
          {
            params: { limit: 100, skip: (page - 1) * 100, title: search },
          }
        );
        setComics(response.data.results);
      } catch (error) {
        console.error("Erreur lors de la récupération des comics :", error);
      }
      setLoading(false);
    };

    fetchComics();
  }, [page, search]);

  useEffect(() => {
    if (search.length > 1) {
      const filteredSuggestions = comics.filter((comic) =>
        comic.title.toLowerCase().includes(search.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [search, comics]);

  const toggleFavorite = (comic) => {
    let newFavorites;
    if (favoriteComics.some((fav) => fav._id === comic._id)) {
      newFavorites = favoriteComics.filter((fav) => fav._id !== comic._id);
    } else {
      newFavorites = [...favoriteComics, comic];
    }
    setFavoriteComics(newFavorites);
    localStorage.setItem("favoriteComics", JSON.stringify(newFavorites));
  };

  return (
    <div>
      <div className="local-search-container">
        <div className="local-search">
          <FontAwesomeIcon icon={faSuperpowers} className="local-search-icon" />
          <input
            type="text"
            placeholder="Rechercher un comic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((comic) => (
              <li key={comic._id} onClick={() => setSearch(comic.title)}>
                {comic.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid-container">
          {comics.map((comic) => (
            <Card
              key={comic._id}
              item={comic}
              isFavorite={favoriteComics.some((fav) => fav._id === comic._id)}
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

export default Comics;
