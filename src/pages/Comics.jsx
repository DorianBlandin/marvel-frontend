import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";

function Comics() {
  const [comics, setComics] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const [favoriteComics, setFavoriteComics] = useState([]);
  const searchRef = useRef();

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/comics",
          {
            params: {
              title: search,
              skip: (page - 1) * 100,
              limit: 100,
            },
          }
        );
        setComics(response.data.results);
      } catch (error) {
        console.error("Erreur lors de la récupération des comics :", error);
      }
    };

    fetchComics();
  }, [search, page]);

  useEffect(() => {
    const storedFavorites =
      JSON.parse(localStorage.getItem("favoriteComics")) || [];
    setFavoriteComics(storedFavorites);
  }, []);

  const toggleFavorite = (comic) => {
    const updatedFavorites = favoriteComics.some((fav) => fav._id === comic._id)
      ? favoriteComics.filter((fav) => fav._id !== comic._id)
      : [...favoriteComics, comic];

    setFavoriteComics(updatedFavorites);
    localStorage.setItem("favoriteComics", JSON.stringify(updatedFavorites));
  };

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearch(input);

    if (input.length > 1) {
      const matched = comics
        .filter((comic) =>
          comic.title.toLowerCase().includes(input.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion.title);
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="local-search-container">
        <div className="local-search" ref={searchRef}>
          <FontAwesomeIcon icon={faSuperpowers} className="local-search-icon" />
          <input
            type="text"
            placeholder="Rechercher un comic..."
            value={search}
            onChange={handleSearchChange}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion._id}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <img
                    src={`${suggestion.thumbnail.path}/portrait_xlarge.${suggestion.thumbnail.extension}`}
                    alt={suggestion.title}
                  />
                  {suggestion.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

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
