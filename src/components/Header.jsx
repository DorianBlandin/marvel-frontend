import { Link, useLocation } from "react-router-dom";
import logo from "/marvel-logo.png";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";

function Header({ onSearch }) {
  const [search, setSearch] = useState("");
  const location = useLocation();

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Marvel Logo" className="logo" />
      </Link>

      {location.pathname !== "/favorites" && (
        <div className="search-container">
          <FontAwesomeIcon icon={faSuperpowers} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>
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
