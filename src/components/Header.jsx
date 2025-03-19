import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "/marvel-logo.png";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";

function Header() {
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
      <Link to="/">
        <img src={logo} alt="Marvel Logo" className="logo" />
      </Link>

      {/* ✅ Recherche globale redirigeant vers /search */}
      {location.pathname !== "/favorites" && (
        <form className="search-container" onSubmit={handleSearch}>
          <FontAwesomeIcon icon={faSuperpowers} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher sur tout le site..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </form>
      )}

      <nav>
        <Link to="/characters" className="nav-btn">
          Personnages
        </Link>
        <Link to="/comics" className="nav-btn">
          Comics
        </Link>
        <Link to="/favorites" className="nav-btn">
          Favoris
        </Link>
      </nav>
    </header>
  );
}

export default Header;
