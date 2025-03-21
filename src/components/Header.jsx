import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "/marvel-logo.png";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

function Header({ userToken, onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search?query=${search}`);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length > 1) {
        try {
          const [charResponse, comicResponse] = await Promise.all([
            axios.get(
              "https://site--marvel--pj2lbzfpm8z4.code.run/characters",
              {
                params: { limit: 5, name: search },
              }
            ),
            axios.get("https://site--marvel--pj2lbzfpm8z4.code.run/comics", {
              params: { limit: 5, title: search },
            }),
          ]);

          const charSuggestions = charResponse.data.results.map((char) => ({
            id: char._id,
            name: char.name,
            type: "character",
            thumbnail: char.thumbnail,
          }));

          const comicSuggestions = comicResponse.data.results.map((comic) => ({
            id: comic._id,
            name: comic.title,
            type: "comic",
            thumbnail: comic.thumbnail,
          }));

          setSuggestions([...charSuggestions, ...comicSuggestions]);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des suggestions :",
            error
          );
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [search]);

  const handleSearchSelect = (suggestion) => {
    if (suggestion.type === "character") {
      navigate(`/character/${suggestion.id}`);
    } else if (suggestion.type === "comic") {
      navigate(`/comics`);
    }
    setSearch("");
    setSuggestions([]);
  };

  return (
    <header className="header">
      <div className="higher-header">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Marvel Logo" className="logo" />
          </Link>
        </div>

        <form className="search-container" onSubmit={handleSearch}>
          <FontAwesomeIcon icon={faSuperpowers} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un personnage ou un comic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSearchSelect(suggestion)}
                >
                  <img
                    src={`${suggestion.thumbnail.path}/portrait_xlarge.${suggestion.thumbnail.extension}`}
                    alt={suggestion.name}
                  />
                  {suggestion.name}{" "}
                  <span className="suggestion-type">
                    ({suggestion.type === "character" ? "Personnage" : "Comic"})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </form>

        <div className="auth-buttons">
          {userToken ? (
            <Link to="/" onClick={onLogout} className="connection-btn">
              Se Déconnecter
            </Link>
          ) : (
            <>
              <Link to="/signup" className="connection-btn">
                S'inscrire
              </Link>
              <Link to="/login" className="connection-btn">
                Se connecter
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="lower-header">
        <Link to="/characters" className="nav-btn">
          Personnages
        </Link>
        <Link to="/comics" className="nav-btn">
          Comics
        </Link>
        <Link to="/favorites" className="nav-btn">
          Favoris
        </Link>
      </div>
    </header>
  );
}

export default Header;
