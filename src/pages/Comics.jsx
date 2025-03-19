import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";

function Comics() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favoriteComics")) || []
  );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const globalSearch = queryParams.get("search") || "";

  useEffect(() => {
    const fetchComics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/comics",
          {
            params: {
              limit: 100,
              skip: (page - 1) * 100,
              title: globalSearch || localSearch,
            },
          }
        );
        setComics(response.data.results);
      } catch (error) {
        console.error("Erreur lors de la récupération des comics :", error);
      }
      setLoading(false);
    };

    fetchComics();
  }, [page, localSearch, globalSearch]);

  const toggleFavorite = (comic) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav._id === comic._id)) {
      updatedFavorites = favorites.filter((fav) => fav._id !== comic._id);
    } else {
      updatedFavorites = [...favorites, comic];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteComics", JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <div className="local-search-container">
        <div className="local-search">
          <FontAwesomeIcon icon={faSuperpowers} className="local-search-icon" />
          <input
            type="text"
            placeholder="Rechercher un comic..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid-container">
          {comics.map((comic) => (
            <div key={comic._id} className="card">
              <img
                src={`${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}`}
                alt={comic.title}
              />
              <p>{comic.title}</p>
              <button
                className="favorite-btn"
                onClick={() => toggleFavorite(comic)}
              >
                {favorites.some((fav) => fav._id === comic._id)
                  ? "💔 Retirer"
                  : "❤️ Ajouter"}
              </button>
            </div>
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
