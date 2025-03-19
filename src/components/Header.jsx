import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "/marvel-logo.png";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";

function Header({ userToken, setUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${searchQuery}`);
    }
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </form>

        <div className="auth-buttons">
          {userToken ? (
            <button className="connection-btn" onClick={() => setUser(null)}>
              Se déconnecter
            </button>
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
