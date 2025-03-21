import { Link, useNavigate } from "react-router-dom";
import logo from "/marvel-logo.png";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

function Header({ userToken, onLogout }) {
  const navigate = useNavigate();
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [headerSuggestions, setHeaderSuggestions] = useState([]);
  const headerSearchRef = useRef();

  const handleHeaderSearchSubmit = (e) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      navigate(`/search?query=${headerSearchQuery}`);
      setHeaderSuggestions([]);
    }
  };

  useEffect(() => {
    const fetchHeaderSuggestions = async () => {
      if (headerSearchQuery.length > 1) {
        try {
          const [charRes, comicRes] = await Promise.all([
            axios.get(
              "https://site--marvel--pj2lbzfpm8z4.code.run/characters",
              {
                params: { limit: 5, name: headerSearchQuery },
              }
            ),
            axios.get("https://site--marvel--pj2lbzfpm8z4.code.run/comics", {
              params: { limit: 5, title: headerSearchQuery },
            }),
          ]);

          const characters = charRes.data.results.map((c) => ({
            id: c._id,
            name: c.name,
            type: "character",
            thumbnail: c.thumbnail,
          }));

          const comics = comicRes.data.results.map((c) => ({
            id: c._id,
            name: c.title,
            type: "comic",
            thumbnail: c.thumbnail,
          }));

          setHeaderSuggestions([...characters, ...comics]);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des suggestions :",
            error
          );
        }
      } else {
        setHeaderSuggestions([]);
      }
    };

    fetchHeaderSuggestions();
  }, [headerSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        headerSearchRef.current &&
        !headerSearchRef.current.contains(e.target)
      ) {
        setHeaderSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionSelect = (item) => {
    if (item.type === "character") {
      navigate(`/character/${item.id}`);
    } else {
      navigate(`/comics`);
    }
    setHeaderSearchQuery("");
    setHeaderSuggestions([]);
    document.activeElement.blur();
  };

  return (
    <header className="header">
      <div className="higher-header">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Marvel Logo" className="logo" />
          </Link>
        </div>

        <form
          ref={headerSearchRef}
          className="search-container"
          onSubmit={handleHeaderSearchSubmit}
        >
          <FontAwesomeIcon icon={faSuperpowers} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un personnage ou un comic..."
            value={headerSearchQuery}
            onChange={(e) => setHeaderSearchQuery(e.target.value)}
            className="search-bar"
            name="header-search"
            autoComplete="off"
          />
          {headerSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {headerSuggestions.map((s) => (
                <li key={s.id} onClick={() => handleSuggestionSelect(s)}>
                  <img
                    src={`${s.thumbnail.path}/portrait_xlarge.${s.thumbnail.extension}`}
                    alt={s.name}
                  />
                  {s.name}{" "}
                  <span className="suggestion-type">
                    ({s.type === "character" ? "Personnage" : "Comic"})
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
