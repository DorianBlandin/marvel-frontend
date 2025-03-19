import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";

function Favorites() {
  const [favoriteCharacters, setFavoriteCharacters] = useState([]);
  const [favoriteComics, setFavoriteComics] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setFavoriteCharacters(
      JSON.parse(localStorage.getItem("favoriteCharacters")) || []
    );
    setFavoriteComics(JSON.parse(localStorage.getItem("favoriteComics")) || []);
  }, []);

  const filteredCharacters = favoriteCharacters.filter((char) =>
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredComics = favoriteComics.filter((comic) =>
    comic.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="local-search-container">
        <div className="local-search">
          <FontAwesomeIcon icon={faSuperpowers} className="local-search-icon" />
          <input
            type="text"
            placeholder="Rechercher dans vos favoris..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="favorites-container">
        <div className="results-grid">
          <div className="results-column">
            <h3>Personnages</h3>
            {filteredCharacters.length === 0 ? (
              <p>Aucun personnage en favori.</p>
            ) : (
              filteredCharacters.map((char) => (
                <div key={char._id} className="card">
                  <Link to={`/character/${char._id}`}>
                    <img
                      src={`${char.thumbnail.path}/portrait_xlarge.${char.thumbnail.extension}`}
                      alt={char.name}
                    />
                    <p>{char.name}</p>
                  </Link>
                </div>
              ))
            )}
          </div>

          <div className="results-column">
            <h3>Comics</h3>
            {filteredComics.length === 0 ? (
              <p>Aucun comic en favori.</p>
            ) : (
              filteredComics.map((comic) => (
                <div key={comic._id} className="card">
                  <img
                    src={`${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}`}
                    alt={comic.title}
                  />
                  <p>{comic.title}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Favorites;
