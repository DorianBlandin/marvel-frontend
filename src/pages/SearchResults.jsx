import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

function SearchResults() {
  const [characters, setCharacters] = useState([]);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const [charResponse, comicResponse] = await Promise.all([
          axios.get("https://site--marvel--pj2lbzfpm8z4.code.run/characters", {
            params: { limit: 10, name: searchQuery },
          }),
          axios.get("https://site--marvel--pj2lbzfpm8z4.code.run/comics", {
            params: { limit: 10, title: searchQuery },
          }),
        ]);
        setCharacters(charResponse.data.results);
        setComics(comicResponse.data.results);
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <div className="search-results-container">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="results-grid">
          {/* ✅ Colonne personnages */}
          <div className="results-column">
            <h3>Personnages</h3>
            {characters.length === 0 ? (
              <p>Aucun personnage trouvé.</p>
            ) : (
              characters.map((char) => (
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

          {/* ✅ Colonne comics */}
          <div className="results-column">
            <h3>Comics</h3>
            {comics.length === 0 ? (
              <p>Aucun comic trouvé.</p>
            ) : (
              comics.map((comic) => (
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
      )}
    </div>
  );
}

export default SearchResults;
